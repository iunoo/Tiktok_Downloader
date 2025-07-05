// api/webhook.js
const bot = require('../bot/bot_core'); // Impor 'mesin' bot yang sudah jadi

// Handler utama yang akan dipanggil Vercel
module.exports = async (request, response) => {
  // PERTAMA: Kita pastikan request yang masuk adalah metode POST
  if (request.method !== 'POST') {
    console.warn('Received a non-POST request, ignoring.');
    return response.status(405).send('Method Not Allowed');
  }

  // KEDUA: Kita cek apakah request.body benar-benar ada isinya
  if (!request.body) {
    console.error('Request body is empty or not parsed!');
    return response.status(400).send('Bad Request: Empty body');
  }

  try {
    // Jika semua aman, baru berikan data ke bot untuk diproses
    await bot.processUpdate(request.body);
  } catch (error) {
    console.error('Error processing update:', error);
  }
  
  // Selalu kirim respons OK ke Telegram agar tidak ada timeout dan pengiriman ulang
  response.status(200).send('OK');
};
