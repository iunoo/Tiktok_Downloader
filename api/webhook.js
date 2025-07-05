// api/webhook.js
// File ini adalah endpoint Serverless untuk Vercel

const bot = require('../bot/bot_core'); // Impor 'mesin' bot yang sudah jadi

// Handler utama yang akan dipanggil Vercel
module.exports = async (request, response) => {
  try {
    // Memberi tahu bot untuk memproses update yang masuk dari Telegram
    await bot.processUpdate(request.body);
  } catch (error) {
    console.error('Error processing update:', error);
  }
  
  // Memberi respons OK ke Telegram
  response.status(200).send('OK');
};