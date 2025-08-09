// bot/plugins/tiktok_photo.js
const { getLocalizedMessage, escapeMarkdownV2 } = require('../../utils/common_utils');
const { MESSAGES, SUPPORT_TELEGRAM_URL } = require('../../config/app_config');

// Import URL mapping functions from tiktok_video
const tiktokVideoPlugin = require('./tiktok_video');

module.exports = async (bot, msg, data, lang) => {
  const chatId = msg.chat.id;
  const originalUrl = msg.text;

  const photoUrls = (Array.isArray(data.video) && data.video.length > 0) ? data.video : [];
  const audioUrl = (data.audio && typeof data.audio === 'string') ? data.audio : (Array.isArray(data.audio) && data.audio.length > 0) ? data.audio[0] : null;

  if (photoUrls.length === 0) {
    return bot.sendMessage(chatId, getLocalizedMessage(lang, 'no_photo_url_found', MESSAGES), { parse_mode: 'Markdown' });
  }

  let videoTitle = data.title || 'Tidak tersedia';
  let audioTitle = data.title_audio || 'Tidak tersedia';
  if (videoTitle.length > 400) videoTitle = videoTitle.substring(0, 400) + '...';
  if (audioTitle.length > 400) audioTitle = audioTitle.substring(0, 400) + '...';

  // Escape special characters for MarkdownV2
  const escapedVideoTitle = escapeMarkdownV2(videoTitle);
  const escapedAudioTitle = escapeMarkdownV2(audioTitle);

  const captionText = [`*Judul* : ${escapedVideoTitle}`, `*Audio* : ${escapedAudioTitle}`].join('\n');

  if (photoUrls.length === 1) {
    const photoUrl = photoUrls[0];
    const successMessage = '✅ *Foto berhasil diunduh\\!*';
    const finalCaption = `${captionText}\n\n${successMessage}`;
    const inlineKeyboard = [];
    const row1 = [];
    row1.push({ text: '🔗 URL Source', url: originalUrl });
    
    // --- PERUBAHAN STRATEGI CALLBACK ---
    if (audioUrl) {
      // Generate short ID and store URL mapping (same as tiktok_video)
      const shortId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      // We'll use the same mapping system from tiktok_video
      if (tiktokVideoPlugin.setUrlMapping) {
        tiktokVideoPlugin.setUrlMapping(shortId, originalUrl);
      }
      row1.push({ text: '🎧 Download Audio', callback_data: `download_audio:${shortId}` });
    }
    // --- AKHIR PERUBAHAN ---
    
    inlineKeyboard.push(row1);
    inlineKeyboard.push([{ text: '❤️ Support iuno.in', url: SUPPORT_TELEGRAM_URL }]);

    try {
      await bot.sendPhoto(chatId, photoUrl, {
        caption: finalCaption,
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      });
    } catch (error) {
      console.error('Error sending single TikTok photo:', error.message);
      await bot.sendMessage(chatId, getLocalizedMessage(lang, 'error_sending_photo', MESSAGES), { parse_mode: 'Markdown' });
    }
  } else {
    const successMessage = `✅ *Slideshow berhasil diunduh\\!* \\(${photoUrls.length} foto\\)`;
    const finalCaption = `${captionText}\n\n${successMessage}`;
    const mediaGroup = photoUrls.map((url, index) => ({ 
      type: 'photo', 
      media: url, 
      caption: index === 0 ? finalCaption : '',
      parse_mode: index === 0 ? 'MarkdownV2' : undefined
    }));

    try {
      await bot.sendMediaGroup(chatId, mediaGroup);
      const inlineKeyboard = [];
      const row1 = [];
      row1.push({ text: '🔗 URL Source', url: originalUrl });
      
      // --- PERUBAHAN STRATEGI CALLBACK ---
      if (audioUrl) {
        // Generate short ID and store URL mapping (same as tiktok_video)
        const shortId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        // We'll use the same mapping system from tiktok_video
        if (tiktokVideoPlugin.setUrlMapping) {
          tiktokVideoPlugin.setUrlMapping(shortId, originalUrl);
        }
        row1.push({ text: '🎧 Download Audio', callback_data: `download_audio:${shortId}` });
      }
      // --- AKHIR PERUBAHAN ---

      inlineKeyboard.push(row1);
      inlineKeyboard.push([{ text: '❤️ Support iuno.in', url: SUPPORT_TELEGRAM_URL }]);
      await bot.sendMessage(chatId, '*Gunakan tombol di bawah untuk tautan tambahan:*', {
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      });
    } catch (error) {
      console.error('Error sending TikTok photo slideshow:', error.message);
      await bot.sendMessage(chatId, getLocalizedMessage(lang, 'error_sending_photo', MESSAGES), { parse_mode: 'Markdown' });
    }
  }
};