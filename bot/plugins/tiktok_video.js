// bot/plugins/tiktok_video.js
const { getLocalizedMessage } = require('../../utils/common_utils');
const { MESSAGES, SUPPORT_TELEGRAM_URL } = require('../../config/app_config');

module.exports = async (bot, msg, data, lang) => {
  const chatId = msg.chat.id;
  const originalUrl = msg.text; // URL TikTok asli dari pengguna

  const videoUrl = (data.video && typeof data.video[0] === 'string') ? data.video[0] : null;
  const audioUrl = (data.audio && typeof data.audio === 'string') ? data.audio : (Array.isArray(data.audio) && data.audio.length > 0) ? data.audio[0] : null;

  if (!videoUrl) {
    return bot.sendMessage(chatId, getLocalizedMessage(lang, 'no_video_url_found', MESSAGES), { parse_mode: 'Markdown' });
  }

  let videoTitle = data.title || 'Tidak tersedia';
  let audioTitle = data.title_audio || 'Tidak tersedia';
  if (videoTitle.length > 400) videoTitle = videoTitle.substring(0, 400) + '...';
  if (audioTitle.length > 400) audioTitle = audioTitle.substring(0, 400) + '...';

  const captionText = [`Judul : ${videoTitle}`, `Audio : ${audioTitle}`].join('\n');
  const successMessage = '✅ Video berhasil diunduh!';
  const finalCaption = `${captionText}\n\n${successMessage}`;

  const inlineKeyboard = [];
  const row1 = [];

  row1.push({ text: '🔗 URL Video', url: videoUrl });

  // --- PERUBAHAN STRATEGI CALLBACK ---
  if (audioUrl) {
    // Menyimpan URL TikTok asli, bukan URL audio yang panjang
    row1.push({ text: '🎧 Download Audio', callback_data: `download_audio:${originalUrl}` });
  }
  // --- AKHIR PERUBAHAN ---

  if (row1.length > 0) {
    inlineKeyboard.push(row1);
  }

  inlineKeyboard.push([{ text: '❤️ Support iuno.in', url: SUPPORT_TELEGRAM_URL }]);

  try {
    await bot.sendVideo(chatId, videoUrl, {
      caption: finalCaption,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } catch (error) {
    console.error('Error sending TikTok video:', error.message);
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'error_sending_video', MESSAGES), { parse_mode: 'Markdown' });
  }
};