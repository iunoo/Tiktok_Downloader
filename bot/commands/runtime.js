// bot/commands/runtime.js
const { logs, formatRuntimeMessage } = require('../../utils/common_utils'); // Mengimpor logs, formatRuntimeMessage
const { MESSAGES } = require('../../config/app_config'); // Mengimpor MESSAGES dari konfigurasi
const { getUserLanguage } = require('../../data/data_store'); // Mengimpor getUserLanguage

// Variabel Start global yang akan dilewatkan dari bot_core.js
let botStartTime;

// Fungsi untuk mengatur waktu mulai bot
const setBotStartTime = (time) => {
  botStartTime = time;
};

module.exports = async (bot, msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId) || 'en'; // Dapatkan bahasa pengguna, default English

  if (!botStartTime) {
    logs('error', 'Bot start time not set for runtime command.', { ChatID: chatId });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing_error', MESSAGES), { parse_mode: 'Markdown' });
    return;
  }

  try {
    const runtimeMessage = formatRuntimeMessage(lang, botStartTime, MESSAGES); // Menggunakan fungsi utilitas
    await bot.sendMessage(chatId, runtimeMessage, { parse_mode: 'Markdown' });
    logs('info', 'Runtime command executed', { ChatID: chatId, Uptime: runtimeMessage });
  } catch (error) {
    logs('error', 'Runtime command failed', { ChatID: chatId, Error: error.message });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing_error', MESSAGES), { parse_mode: 'Markdown' });
  }
};

// Mengekspor fungsi setBotStartTime agar bisa dipanggil dari bot_core.js
module.exports.setBotStartTime = setBotStartTime;