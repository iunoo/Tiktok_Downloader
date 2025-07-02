// bot/handlers/callback_query_handler.js
const { logs, getLocalizedMessage, formatRuntimeMessage } = require('../../utils/common_utils'); // Utilitas umum
const { getUserLanguage, setUserLanguage, getConversationHistory, setConversationHistory } = require('../../data/data_store'); // Data Store
const { MESSAGES, AI_SYSTEM_PROMPT } = require('../../config/app_config'); // Konfigurasi aplikasi
const getStartCommandKeyboard = require('../commands/start').getMainKeyboard; // Mengimpor getMainKeyboard dari start.js

// Variabel untuk waktu mulai bot, akan diatur dari bot_core.js
let botStartTime;

// Fungsi untuk mengatur waktu mulai bot
const setBotStartTime = (time) => {
  botStartTime = time;
};

// Handler utama untuk callback query
module.exports = async (bot, callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;
  const currentLang = getUserLanguage(chatId) || 'en'; // Dapatkan bahasa pengguna, default English

  try {
    let newText = null;
    let newMarkup = null;

    if (data.startsWith('lang_')) {
      const newLang = data.split('_')[1];
      if (newLang !== currentLang) { // Hanya update jika bahasa berubah
        setUserLanguage(chatId, newLang);
        newText = getLocalizedMessage(newLang, 'start', MESSAGES); // Gunakan pesan start untuk perubahan bahasa
        newMarkup = { inline_keyboard: getStartCommandKeyboard(newLang) };
        // Perbarui prompt sistem AI dalam riwayat percakapan yang ada
        let history = getConversationHistory(chatId);
        if (history && history.length > 0 && history[0].role === 'system') {
          // Perbarui prompt sistem AI dengan bahasa yang baru
          const updatedSystemPrompt = AI_SYSTEM_PROMPT.replace(/Respond in Indonesian|Respond in English/g, `Respond in ${newLang === 'id' ? 'Indonesian' : 'English'}`);
          history[0].content = updatedSystemPrompt;
          setConversationHistory(chatId, history);
        }
        logs('info', `Language changed to ${newLang} via callback`, { ChatID: chatId });
      }
    } else if (data === 'runtime') {
      if (!botStartTime) {
        logs('error', 'Bot start time not set for runtime callback command.', { ChatID: chatId });
        newText = getLocalizedMessage(currentLang, 'processing_error', MESSAGES);
      } else {
        newText = formatRuntimeMessage(currentLang, botStartTime, MESSAGES); // Menggunakan fungsi utilitas
      }
      newMarkup = { inline_keyboard: getStartCommandKeyboard(currentLang) }; // Tetap tampilkan keyboard utama
      logs('info', 'Runtime requested via button', { ChatID: chatId });
    } else if (data === 'help') {
      newText = getLocalizedMessage(currentLang, 'help', MESSAGES);
      newMarkup = { inline_keyboard: getStartCommandKeyboard(currentLang) }; // Tetap tampilkan keyboard utama
      logs('info', 'Help requested via button', { ChatID: chatId });
    }

    if (newText) {
      await bot.editMessageText(newText, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: 'Markdown',
        reply_markup: newMarkup,
      });
    }

    bot.answerCallbackQuery(callbackQuery.id); // Selalu jawab callback query
  } catch (error) {
    if (error.message.includes('message is not modified')) {
      logs('warning', 'Message not modified (callback query ignored)', { ChatID: chatId, Error: error.message, Data: data });
      bot.answerCallbackQuery(callbackQuery.id);
      return;
    }
    logs('error', 'Callback query failed', { ChatID: chatId, Error: error.message, Data: data });
    await bot.sendMessage(chatId, getLocalizedMessage(currentLang, 'processing_error', MESSAGES), { parse_mode: 'Markdown' });
    bot.answerCallbackQuery(callbackQuery.id);
  }
};

// Mengekspor fungsi setBotStartTime agar bisa dipanggil dari bot_core.js
module.exports.setBotStartTime = setBotStartTime;