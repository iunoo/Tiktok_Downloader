// bot/commands/help.js
const { logs, getLocalizedMessage } = require('../../utils/common_utils');
const { MESSAGES } = require('../../config/app_config');
const { getUserLanguage } = require('../../data/data_store');
const { getMainKeyboard } = require('./start'); // Mengimpor getMainKeyboard dari start.js

const handleHelpCommand = async (bot, msg) => {
  const chatId = msg.chat.id;
  const lang = getUserLanguage(chatId) || 'en';

  try {
    const helpMessage = getLocalizedMessage(lang, 'help', MESSAGES);
    const poweredBy = `\n\nPowered by: iuno.in`; // Teks "Powered by"
    
    await bot.sendMessage(chatId, helpMessage + poweredBy, { // Menambahkan teks "Powered by"
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: getMainKeyboard(lang) }, // Menggunakan keyboard yang sama dengan /start
    });
    logs('info', 'Help command executed', { ChatID: chatId, Language: lang });
  } catch (error) {
    logs('error', 'Help command failed', { ChatID: chatId, Error: error.message });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing_error', MESSAGES), { parse_mode: 'Markdown' });
  }
};

module.exports = handleHelpCommand;