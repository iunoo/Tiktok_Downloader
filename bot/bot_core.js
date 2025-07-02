// bot/bot_core.js
const TelegramBot = require('node-telegram-bot-api');
const { logs } = require('../utils/common_utils'); // Utilitas logging

// Konfigurasi dari app_config.js
const { BOT_TOKEN, SUPPORT_TELEGRAM_URL } = require('../config/app_config');

// Mengimpor semua command handler
const startCommand = require('./commands/start');
const helpCommand = require('./commands/help');
const runtimeCommand = require('./commands/runtime');

// Mengimpor semua event handler
const messageHandler = require('./handlers/message_handler');
const callbackQueryHandler = require('./handlers/callback_query_handler');

let bot; // Deklarasi bot di luar fungsi untuk akses global
let startTime; // Deklarasi startTime di luar fungsi

// Fungsi untuk menginisialisasi dan memulai bot Telegram
function startTelegramBot() {
  logs('info', 'Initializing Telegram bot...');
  bot = new TelegramBot(BOT_TOKEN, { polling: true });
  startTime = new Date(); // Catat waktu mulai bot

  // Set waktu mulai bot di command handlers yang memerlukannya
  runtimeCommand.setBotStartTime(startTime);
  callbackQueryHandler.setBotStartTime(startTime);

  // Banner saat bot dinyalakan (bisa dipindahkan ke start.js jika ingin lebih global)
  // logs('info', 'TikTok Downloader Bot with Enhanced AI Assistant');
  // logs('info', '========================================');

  logs('info', 'Bot started polling for updates.', { Token: BOT_TOKEN ? BOT_TOKEN.slice(0, 10) + '...' : 'Not Set' });

  // Set Bot Commands yang akan muncul di menu Telegram
  bot.setMyCommands([
    { command: '/start', description: 'Mulai bot / Start the bot' },
    { command: '/help', description: 'Panduan penggunaan / View usage guide' },
    { command: '/runtime', description: 'Cek waktu aktif bot / Check bot uptime' },
  ]);

  // Event Listener:
  // 1. Pesan Teks Umum
  bot.on('message', (msg) => messageHandler(bot, msg)); // Delegasikan ke message_handler.js

  // 2. Callback Query (Tombol Inline)
  bot.on('callback_query', (query) => callbackQueryHandler(bot, query)); // Delegasikan ke callback_query_handler.js

  // 3. Perintah Khusus (di-handle oleh bot.onText, yang akan memicu message handler juga)
  // Walaupun message_handler juga akan memprosesnya, onText ini memastikan command spesifik
  // langsung mengarah ke handler yang dituju.
  bot.onText(/^\/start$/, (msg) => startCommand(bot, msg));
  bot.onText(/^\/help$/, (msg) => helpCommand(bot, msg));
  bot.onText(/^\/runtime$/, (msg) => runtimeCommand(bot, msg));

  // Penanganan error polling
  bot.on('polling_error', (error) => {
    logs('error', 'Polling error occurred!', { Error: error.message });
  });

  logs('success', 'Telegram Bot is fully operational.');
}

// Fungsi untuk menghentikan bot (jika diperlukan)
function stopTelegramBot() {
  if (bot) {
    bot.stopPolling();
    logs('info', 'Telegram Bot polling stopped.');
  }
}

module.exports = {
  startTelegramBot,
  stopTelegramBot,
  getBotInstance: () => bot, // Mengizinkan akses ke instance bot jika diperlukan di luar
  getStartTime: () => startTime
};