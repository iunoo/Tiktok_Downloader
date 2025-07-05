// bot/bot_core.js
const TelegramBot = require('node-telegram-bot-api');
const { logs } = require('../utils/common_utils');
const { BOT_TOKEN } = require('../config/app_config');

// Mengimpor semua command dan event handler
const startCommand = require('./commands/start');
const helpCommand = require('./commands/help');
const runtimeCommand = require('./commands/runtime');
const messageHandler = require('./handlers/message_handler');
const callbackQueryHandler = require('./handlers/callback_query_handler');

// --- PERUBAHAN UTAMA: Bot dibuat tanpa langsung memulai polling ---
logs('info', 'Creating Telegram bot instance...');
// Opsi { polling: true } dihilangkan agar mode bisa dipilih nanti (di run-polling.js atau webhook.js)
const bot = new TelegramBot(BOT_TOKEN);
const startTime = new Date();

// Memberikan waktu mulai ke command /runtime
runtimeCommand.setBotStartTime(startTime);

// Mengatur daftar perintah yang muncul di menu Telegram
bot.setMyCommands([
  { command: '/start', description: 'Mulai bot / Start the bot' },
  { command: '/help', description: 'Panduan penggunaan / View usage guide' },
  { command: '/runtime', description: 'Cek waktu aktif bot / Check bot uptime' },
]);

// Memasang semua 'telinga' atau event listener ke bot
bot.on('message', (msg) => messageHandler(bot, msg));
bot.on('callback_query', (query) => callbackQueryHandler(bot, query));
bot.onText(/^\/start$/, (msg) => startCommand(bot, msg));
bot.onText(/^\/help$/, (msg) => helpCommand(bot, msg));
bot.onText(/^\/runtime$/, (msg) => runtimeCommand(bot, msg));
bot.on('polling_error', (error) => logs('error', 'Polling error occurred!', { Error: error.message }));

logs('success', 'Telegram bot instance created and listeners are attached.');

// Mengekspor instance bot yang sudah siap pakai untuk digunakan oleh file lain
module.exports = bot;