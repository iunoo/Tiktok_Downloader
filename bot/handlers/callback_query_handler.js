// bot/handlers/callback_query_handler.js
const { logs, getLocalizedMessage } = require('../../utils/common_utils');
const { setUserLanguage, getUserLanguage } = require('../../data/data_store');
const { MESSAGES } = require('../../config/app_config');
const start = require('../commands/start');
const help = require('../commands/help');
const runtime = require('../commands/runtime');
const { ttdl } = require('btch-downloader');
const axios = require('axios');

module.exports = async (bot, callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  logs('info', 'Callback query received', { ChatID: chatId, Data: data.split(':')[0] });

  try {
    await bot.answerCallbackQuery(callbackQuery.id);

    if (data.startsWith('lang_')) {
      const lang = data.split('_')[1];
      setUserLanguage(chatId, lang);
      await bot.sendMessage(chatId, `Bahasa telah diubah ke ${lang === 'id' ? 'Indonesia' : 'English'}.`);
      await start(bot, msg);
      return;
    }

    if (data.startsWith('download_audio:')) {
      const tiktokUrl = data.substring('download_audio:'.length);
      let processingMsg = null;
      try {
        processingMsg = await bot.sendMessage(chatId, '⏳ Memproses ulang untuk audio, mohon tunggu...');
        
        const tiktokData = await ttdl(tiktokUrl);
        const audioUrl = (tiktokData.audio && typeof tiktokData.audio === 'string') ? tiktokData.audio : (Array.isArray(tiktokData.audio) && tiktokData.audio.length > 0) ? tiktokData.audio[0] : null;

        if (audioUrl) {
          const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
          const audioBuffer = Buffer.from(response.data, 'binary');
          
          // --- PERUBAHAN: Membuat nama file dari judul audio ---
          // 1. Ambil judul audio, atau gunakan nama default jika tidak ada
          let audioTitle = tiktokData.title_audio || 'audio_iuno_in';
          
          // 2. Bersihkan judul dari karakter yang tidak diizinkan di nama file
          const sanitizedFilename = audioTitle.replace(/[/\\?%*:|"<>]/g, '-') + '.mp3';
          
          // 3. Kirim sebagai DOKUMEN dengan nama file kustom
          await bot.sendDocument(chatId, audioBuffer, {
            caption: `Audio dari: ${tiktokData.title || ''}`
          }, {
            filename: sanitizedFilename,
            contentType: 'audio/mpeg'
          });
          // --- AKHIR PERUBAHAN ---
          
          await bot.deleteMessage(chatId, processingMsg.message_id);
        } else {
          throw new Error('Audio URL not found on re-fetch.');
        }

      } catch (error) {
        logs('error', 'Failed to download or send audio from callback', { ChatID: chatId, Error: error.message });
        if (processingMsg) {
          await bot.deleteMessage(chatId, processingMsg.message_id);
        }
        await bot.sendMessage(chatId, getLocalizedMessage(getUserLanguage(chatId), 'error_sending_audio', MESSAGES));
      }
      return;
    }

    switch (data) {
      case 'start':
        await start(bot, msg);
        break;
      case 'help':
        await help(bot, msg);
        break;
      case 'runtime':
        await runtime(bot, msg);
        break;
      default:
        await bot.sendMessage(chatId, 'Perintah tidak dikenal.');
        break;
    }
  } catch (error) {
    logs('error', 'Callback query handling failed', {
      ChatID: chatId,
      Data: data,
      Error: error.message,
    });
  }
};