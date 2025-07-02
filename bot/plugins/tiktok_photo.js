// bot/plugins/tiktok_photo.js
const { sleep, logs, getLocalizedMessage } = require('../../utils/common_utils');
const { MESSAGES } = require('../../config/app_config');
const axios = require('axios');
const https = require('follow-redirects').https;
const path = require('path');
const { URL } = require('url');
const fs = require('fs'); // Diperlukan untuk operasi file
const os = require('os'); // Diperlukan untuk os.tmpdir()

async function tiktok_photo(bot, msg, data, userLang) {
  const From = msg.chat.id;
  const { title, title_audio, video, audio } = data;

  const caption = `Title: ${title || 'N/A'}\nAudio: ${title_audio || 'N/A'}`;

  try {
    if (video && video.length > 0) {
      if (video.length === 1) {
        logs('info', 'Sending single TikTok photo...', { ChatID: From, PhotoURL: video[0].slice(0, 50) + '...' });
        await bot.sendPhoto(From, video[0], { caption: caption });
        logs('success', 'Single TikTok photo sent', { ChatID: From });
      } else {
        logs('info', `Sending ${video.length} TikTok photos as a group...`, { ChatID: From });
        const media = video.map((url, index) => ({
          type: 'photo',
          media: url,
          caption: index === 0 ? caption : undefined
        }));
        await bot.sendMediaGroup(From, media);
        logs('success', 'TikTok photo group sent', { ChatID: From });
      }
      await sleep(3000);
    } else {
      logs('warning', 'No photo URLs found for TikTok slideshow.', { ChatID: From });
      await bot.sendMessage(From, getLocalizedMessage(userLang, 'no_photo_url_found', MESSAGES), { parse_mode: 'Markdown' });
      return;
    }

    if (audio && audio.length > 0 && audio[0]) {
      const audioUrl = audio[0];
      let filename = 'tiktok_audio_default.mp3'; // Default fallback yang lebih unik
      let tempFilePath = '';

      try {
        const parsedUrl = new URL(audioUrl);
        const pathSegments = parsedUrl.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];

        const idMatch = lastSegment.match(/^(\d+)\.mp3$/);
        if (idMatch && idMatch[1]) {
          filename = `${idMatch[1]}.mp3`;
        } else {
          const baseName = path.basename(parsedUrl.pathname);
          if (baseName && baseName !== 'music' && baseName !== 'video' && baseName !== 'data' && baseName.endsWith('.mp3')) {
            filename = baseName;
          } else {
            const numberInSegment = lastSegment.match(/\d+/);
            if (numberInSegment && numberInSegment[0]) {
              filename = `${numberInSegment[0]}.mp3`;
            } else {
              // Fallback dengan judul audio dan timestamp untuk keunikan
              const cleanTitle = (title_audio || 'audio').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30); // Bersihkan judul
              filename = `${cleanTitle}_${Date.now()}.mp3`;
            }
          }
        }
      } catch (e) {
        logs('warning', `Failed to parse audio URL for filename: ${e.message}`, { AudioURL: audioUrl });
        filename = `tiktok_audio_fallback_${Date.now()}.mp3`; // Fallback dengan timestamp jika parsing error
      }

      // Pastikan selalu berakhir dengan .mp3
      if (!filename.endsWith('.mp3')) {
          filename += '.mp3';
      }

      logs('info', 'Attempting to send TikTok audio by direct download (using follow-redirects)...', { ChatID: From, AudioURL: audioUrl.slice(0, 50) + '...' });
      logs('info', `Proposed filename: ${filename}`, { ChatID: From }); // Log nama file yang diusulkan
      
      tempFilePath = path.join(os.tmpdir(), filename); // Menggunakan direktori sementara sistem
      logs('info', `Downloading audio to temporary file: ${tempFilePath}`, { ChatID: From, AudioURL: audioUrl.slice(0, 50) + '...' });
      
      try {
        const writer = fs.createWriteStream(tempFilePath);
        const response = await axios({
            method: 'get',
            url: audioUrl,
            responseType: 'stream'
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        logs('success', `Audio downloaded to temporary file: ${tempFilePath}`, { ChatID: From });

        await bot.sendAudio(From, tempFilePath, { // Mengirim dari file lokal
          caption: `Audio: ${title_audio || 'N/A'}`,
          filename: filename, // Tetap berikan filename eksplisit
          reply_markup: {
            inline_keyboard: [[{ text: '🎵 URL Audio', url: audioUrl }]]
          }
        });
        logs('success', 'TikTok audio sent successfully (from local file)', { ChatID: From, SentFilename: filename }); // Log nama file yang *dikirim*
      } catch (audioDownloadError) {
        logs('error', `Failed to download or send TikTok audio from local file. Error: ${audioDownloadError.message}`, { ChatID: From, AudioURL: audioUrl, FullError: audioDownloadError });
        await bot.sendMessage(From, getLocalizedMessage(userLang, 'error_sending_audio', MESSAGES), { parse_mode: 'Markdown' });
      } finally {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          logs('info', `Temporary audio file deleted: ${tempFilePath}`, { ChatID: From });
        }
      }
      await sleep(3000);
    } else {
      logs('warning', 'No audio URL found for TikTok photos.', { ChatID: From });
    }

  } catch (error) {
    logs('error', 'General error in TikTok photo handler', { ChatID: From, Error: error.message });
    await bot.sendMessage(From, getLocalizedMessage(userLang, 'error_sending_photo', MESSAGES), { parse_mode: 'Markdown' });
  }
}

module.exports = tiktok_photo;