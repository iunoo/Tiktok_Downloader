// start.js
const chalk = require('chalk'); // Untuk pewarnaan konsol
const { logs } = require('./utils/common_utils'); // Mengimpor fungsi logs
const { startTelegramBot } = require('./bot/bot_core'); // Mengimpor fungsi start bot
const startExpressServer = require('./webserver/express_server'); // Mengimpor fungsi start server web

// --- Tampilan Banner ---
const displayBanner = () => {
  console.log(chalk.yellow.bold('TikTok Downloader Bot with Enhanced AI Assistant'));
  console.log(chalk.cyan('========================================'));
};

// --- Fungsi Utama untuk Memulai Aplikasi ---
async function initializeAndStartApp() {
  displayBanner(); // Tampilkan banner
  logs('info', 'Application initialization started...');

  try {
    // 1. Mulai bot Telegram
    logs('info', 'Starting Telegram bot components...');
    startTelegramBot();
    logs('success', 'Telegram bot components started successfully.');

    // 2. Mulai server Express (untuk health check)
    logs('info', 'Starting Express web server...');
    startExpressServer();
    logs('success', 'Express web server started successfully.');

    logs('success', 'All application services are running!');

  } catch (error) {
    logs('error', 'Failed to initialize or start application services!', { Error: error.message });
    process.exit(1); // Keluar dari proses dengan kode error
  }
}

// Panggil fungsi utama untuk memulai aplikasi
initializeAndStartApp();