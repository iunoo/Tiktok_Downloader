// run-polling.js
// File ini khusus untuk menjalankan bot dalam mode Long Polling (di VPS).

const { logs } = require('./utils/common_utils');
const bot = require('./bot/bot_core'); // Impor 'mesin' bot yang sudah jadi.

logs('info', 'Starting bot in Long Polling mode...');

// Menyalakan 'mesin' bot.
bot.startPolling();

logs('success', 'Bot is now polling for updates from Telegram.');
console.log('Bot Long Polling berjalan. Tekan CTRL+C untuk berhenti.');