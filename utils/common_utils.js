// utils/common_utils.js
const chalk = require('chalk'); // Untuk pewarnaan log di konsol

// Fungsi untuk logging konsol yang lebih baik
const logs = (type, message, details = {}) => {
  const timestamp = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' });
  let color, prefix;

  switch (type.toLowerCase()) {
    case 'info':
      color = chalk.cyan;
      prefix = '[INFO]';
      break;
    case 'success':
      color = chalk.green;
      prefix = '[SUCCESS]';
      break;
    case 'error':
      color = chalk.red;
      prefix = '[ERROR]';
      break;
    case 'warning':
      color = chalk.yellow;
      prefix = '[WARNING]';
      break;
    default:
      color = chalk.white;
      prefix = '[LOG]';
  }

  const logMessage = `${prefix} [${timestamp}] ${message}`;
  const detailLines = Object.entries(details)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join('\n');

  console.log(color(logMessage));
  if (detailLines) console.log(color(detailLines));
};

// Fungsi untuk menunda eksekusi (sleep)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk menghitung waktu aktif (runtime) bot
function calculateRuntime(startTime) {
  const now = new Date();
  const uptimeMilliseconds = now - startTime;
  const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  return { hours: uptimeHours, minutes: uptimeMinutes % 60, seconds: uptimeSeconds % 60 };
}

// Fungsi untuk memformat pesan runtime (menggunakan config.MESSAGES)
const formatRuntimeMessage = (lang, startTime, messages) => {
  const { hours, minutes, seconds } = calculateRuntime(startTime);
  let message = messages[lang].runtime;
  message = message.replace('{hours}', hours).replace('{minutes}', minutes).replace('{seconds}', seconds);
  return message;
};

// Fungsi untuk mendapatkan pesan multi-bahasa dari konfigurasi
const getLocalizedMessage = (lang, messageKey, configMessages) => {
  return (configMessages[lang] && configMessages[lang][messageKey]) ? configMessages[lang][messageKey] : configMessages['en'][messageKey]; // Default ke English
};

// Fungsi untuk escape karakter khusus MarkdownV2
const escapeMarkdownV2 = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Escape semua karakter khusus MarkdownV2
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
};

module.exports = {
  logs,
  sleep,
  calculateRuntime,
  formatRuntimeMessage,
  getLocalizedMessage,
  escapeMarkdownV2,
};