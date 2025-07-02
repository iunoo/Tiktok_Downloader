// bot/commands/start.js
const { logs, getLocalizedMessage } = require('../../utils/common_utils');
const { MESSAGES } = require('../../config/app_config');
const { getUserLanguage } = require('../../data/data_store');

// Fungsi untuk mendapatkan inline keyboard utama
const getMainKeyboard = (currentLang) => {
  const keyboard = [];

  const langButtons = [];
  if (currentLang !== 'id') {
    langButtons.push({ text: '🇮🇩 Bahasa Indonesia', callback_data: 'lang_id' });
  }
  if (currentLang !== 'en') {
    langButtons.push({ text: '🇬🇧 English', callback_data: 'lang_en' });
  }
  if (langButtons.length > 0) {
    keyboard.push(langButtons);
  }

  if (currentLang === 'id') {
    keyboard.push([
      { text: '🕒 Runtime Bot', callback_data: 'runtime' },
      { text: '📚 Panduan', callback_data: 'help' }
    ]);
  } else {
    keyboard.push([
      { text: '🕒 Bot Runtime', callback_data: 'runtime' },
      { text: '📚 Guide', callback_data: 'help' }
    ]);
  }

  // Tombol Dukungan sudah mengambil dari config/app_config.js
  if (currentLang === 'id') {
    keyboard.push([
      { text: '❤️ Dukungan', url: MESSAGES.id.support_url } // Menggunakan support_url dari MESSAGES
    ]);
  } else {
    keyboard.push([
      { text: '❤️ Support', url: MESSAGES.en.support_url } // Menggunakan support_url dari MESSAGES
    ]);
  }

  return keyboard;
};

// Fungsi utama untuk perintah /start
const handleStartCommand = async (bot, msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId) || 'en';

  try {
    const startMessage = getLocalizedMessage(lang, 'start', MESSAGES);
    const poweredBy = `\n\nPowered by: iuno.in`; // Teks "Powered by"
    
    await bot.sendMessage(chatId, startMessage + poweredBy, { // Menambahkan teks "Powered by"
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: getMainKeyboard(lang) },
    });
    logs('info', 'Start command executed', { ChatID: chatId, Language: lang });
  } catch (error) {
    logs('error', 'Start command failed', { ChatID: chatId, Error: error.message });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing_error', MESSAGES), { parse_mode: 'Markdown' });
  }
};

module.exports = handleStartCommand;
module.exports.getMainKeyboard = getMainKeyboard;