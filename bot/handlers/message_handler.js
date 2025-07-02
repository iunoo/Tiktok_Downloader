// bot/handlers/message_handler.js
const axios = require('axios'); // Diperlukan untuk permintaan AI
const { logs, getLocalizedMessage } = require('../../utils/common_utils'); // Utilitas umum
const { getUserLanguage, getConversationHistory, setConversationHistory } = require('../../data/data_store'); // Data Store
const { MESSAGES, AI_API_URL, AI_SYSTEM_PROMPT, AI_CHAT_HISTORY_LIMIT, SUPPORT_TELEGRAM_URL, BOT_AUTHOR, GROQ_API_KEY, GROQ_MODEL_NAME } = require('../../config/app_config'); // Import semua konfigurasi
const tiktok_video = require('../plugins/tiktok_video'); // Plugin video TikTok
const tiktok_photo = require('../plugins/tiktok_photo'); // Plugin foto TikTok
const { version } = require('../../package.json'); // Untuk User-Agent AI API

// Daftar reaksi yang sopan/positif untuk bot
const POSITIVE_REACTIONS = ['👍', '🎉', '🔥', '❤️', '🤩', '💯', '✨']; // Daftar emoji reaksi

// Fungsi untuk memeriksa apakah chat bersifat pribadi
const isPrivateChat = (msg) => {
  return msg.chat.type === 'private';
};

// Fungsi pembantu untuk membersihkan URL dari teks (untuk respons AI)
const removeUrls = (text) => {
  // Regex yang cocok dengan berbagai format URL (http/https, www, domain, path, dll)
  const urlRegex = /(https?:\/\/(?:www\.|vt\.)?tiktok\.com\/[^\s]+|https?:\/\/[^\s]+\.[^\s]+(?:\/[^\s]*)?)/gi;
  // Mengganti URL dengan frasa seperti "[Link Removed]"
  return text.replace(urlRegex, '[Link Removed]');
};

// Fungsi untuk mengkueri API AI
const queryAI = async (bot, chatId, userMessage, lang) => {
  if (!GROQ_API_KEY) {
    logs('error', 'Groq API Key is not set. AI functionality will not work.', { ChatID: chatId });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'ai_error_fallback', MESSAGES), { parse_mode: 'Markdown' });
    return;
  }
  if (!GROQ_MODEL_NAME) {
    logs('error', 'Groq model name is not set. AI functionality will not work.', { ChatID: chatId });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'ai_error_fallback', MESSAGES), { parse_mode: 'Markdown' });
    return;
  }

  try {
    let currentHistory = getConversationHistory(chatId) || [];
    const systemPromptContent = AI_SYSTEM_PROMPT;

    // Tambahkan prompt sistem ke awal riwayat jika belum ada atau berbeda
    if (currentHistory.length === 0 || currentHistory[0].role !== 'system' || currentHistory[0].content !== systemPromptContent) {
      currentHistory.unshift({ role: 'system', content: systemPromptContent });
    }

    // Tambahkan pesan pengguna ke riwayat
    currentHistory.push({ role: 'user', content: userMessage });

    // Pembersihan conversationHistory: Simpan hanya AI_CHAT_HISTORY_LIMIT pasangan pesan (user/assistant) + system prompt
    if (currentHistory.length > (AI_CHAT_HISTORY_LIMIT * 2) + 1) {
      const systemMessage = currentHistory[0];
      currentHistory = [systemMessage, ...currentHistory.slice(- (AI_CHAT_HISTORY_LIMIT * 2))];
    }
    setConversationHistory(chatId, currentHistory);

    logs('info', `Sending to Groq AI (${GROQ_MODEL_NAME})...`, { ChatID: chatId, MessagesLength: currentHistory.length, UserMessage: userMessage.slice(0, 50) });
    const response = await axios.post(
      AI_API_URL,
      {
        messages: currentHistory,
        model: GROQ_MODEL_NAME
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `TikTokBot/${version}`,
          'Accept': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        timeout: 60000, // Timeout 60 detik
      }
    );

    let ai_response;
    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content) {
      ai_response = response.data.choices[0].message.content;
    } else {
      logs('error', 'Unexpected AI API response structure from Groq.', { ChatID: chatId, ResponseData: JSON.stringify(response.data) });
      throw new Error('Unexpected AI API response structure.');
    }

    // Bersihkan URL dari respons AI
    const cleaned_ai_response = removeUrls(ai_response);

    currentHistory.push({ role: 'assistant', content: cleaned_ai_response });
    setConversationHistory(chatId, currentHistory);

    await bot.sendMessage(chatId, cleaned_ai_response, { parse_mode: 'Markdown' });
    logs('success', 'AI responded', {
      ChatID: chatId,
      Query: userMessage.slice(0, 50) + '...',
      Response: cleaned_ai_response.slice(0, 50) + '...',
    });
  } catch (error) {
    logs('error', 'AI API request failed', {
      ChatID: chatId,
      Error: error.message,
      ResponseData: error.response ? JSON.stringify(error.response.data) : 'N/A'
    });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'ai_error_fallback', MESSAGES), { parse_mode: 'Markdown' });
  }
};

// Handler utama untuk semua pesan
module.exports = async (bot, msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const lang = getUserLanguage(chatId) || 'en';

  // Abaikan pesan dari bot itu sendiri
  if (msg.from.is_bot) {
    logs('info', 'Ignored message from self', { ChatID: chatId, UserID: msg.from.id });
    return;
  }

  // --- LOGIKA BARU: Bot memberikan reaksi acak pada pesan pengguna ---
  try {
    const randomReaction = POSITIVE_REACTIONS[Math.floor(Math.random() * POSITIVE_REACTIONS.length)];
    await bot.setMessageReaction(chatId, msg.message_id, {
        emoji: randomReaction,
        is_big: false,
        allow_sending_without_reply: true // <--- BARIS INI DITAMBAHKAN
    });
    logs('info', `Bot reacted to message with ${randomReaction}`, { ChatID: chatId, MessageId: msg.message_id });
  } catch (reactError) {
    logs('warning', `Failed to react to message: ${reactError.message}`, { ChatID: chatId, MessageId: msg.message_id });
  }
  // --- AKHIR LOGIKA BARU ---

  // Validasi URL TikTok: harus diawali dengan https:// dan mengandung tiktok.com
  const isTikTokUrlPattern = /^https:\/\/(www\.)?(vt\.)?tiktok\.com\//;
  const isTikTokUrl = isTikTokUrlPattern.test(text.trim());

  logs('info', 'Message received', {
    ChatID: chatId,
    Text: text.length > 50 ? text.slice(0, 47) + '...' : text,
    Type: isTikTokUrl && text.trim() === text ? 'TikTok URL' : text.startsWith('/') ? 'Command' : 'Text',
    IsPrivate: isPrivateChat(msg)
  });

  let processingMessageId = null;

  try {
    // --- LOGIKA BARU: Validasi prefix URL yang lebih ketat di awal ---
    // Jika link mengandung 'tiktok.com' tapi TIDAK diawali dengan 'https://'
    // atau diawali dengan 'http://' atau 'ps://'
    if (text.trim().includes('tiktok.com') && !text.trim().startsWith('https://')) {
        await bot.sendMessage(chatId, getLocalizedMessage(lang, 'invalid_url_protocol', MESSAGES), { parse_mode: 'Markdown' });
        logs('warning', 'Invalid TikTok URL protocol/prefix detected.', { ChatID: chatId, Text: text });
        return; // Hentikan pemrosesan
    }
    // --- AKHIR LOGIKA BARU ---

    if (isTikTokUrl && text.trim() === text) { // Jika hanya ada URL TikTok (tanpa teks lain)
      const sentMessage = await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing', MESSAGES), { parse_mode: 'Markdown' });
      processingMessageId = sentMessage.message_id;
      
      try {
        const { ttdl } = require('btch-downloader');
        const data = await ttdl(text.trim());

        if (!data || !data.video || data.video.length === 0) {
          logs('error', 'ttdl returned no video data', { ChatID: chatId, URL: text, Data: data });
          await bot.sendMessage(chatId, getLocalizedMessage(lang, 'no_video_data', MESSAGES), { parse_mode: 'Markdown' });
          return;
        }

        const isMultiPhoto = data.video.length > 1;
        const isSinglePhotoByUrl = data.video[0].includes('tplv-photomode') || data.video[0].endsWith('.jpeg') || data.video[0].endsWith('.jpg') || data.video[0].endsWith('.png');
        const isVideoContent = data.video.length === 1 && !isSinglePhotoByUrl;

        if (isMultiPhoto || isSinglePhotoByUrl) {
          logs('info', `Detected TikTok photo/slideshow (${isMultiPhoto ? 'multi-photo' : 'single photo'})`, { ChatID: chatId, URL: text });
          await tiktok_photo(bot, msg, data, lang);
        } else if (isVideoContent) {
          logs('info', 'Detected TikTok video', { ChatID: chatId, URL: text });
          await tiktok_video(bot, msg, data, lang);
        } else {
            logs('warning', 'Could not determine TikTok content type, defaulting to video handler.', { ChatID: chatId, URL: text, VideoUrls: data.video });
            await tiktok_video(bot, msg, data, lang);
        }

        // Hapus pesan "sedang memproses" setelah media berhasil dikirim
        if (processingMessageId) {
            await bot.deleteMessage(chatId, processingMessageId).catch(e => logs('warning', 'Failed to delete processing message', { ChatID: chatId, MessageId: processingMessageId, Error: e.message }));
        }

        // Tambahkan pesan powered by setelah berhasil mengirim media
        await bot.sendMessage(chatId, `Powered by ${BOT_AUTHOR}`, {
            reply_markup: {
                inline_keyboard: [[{ text: '👨‍💻 Support', url: SUPPORT_TELEGRAM_URL }]]
            }
        });
        logs('success', 'TikTok URL processed successfully', { ChatID: chatId, URL: text });

      } catch (downloadError) {
        logs('error', 'Handler failed for TikTok URL', { ChatID: chatId, Error: downloadError.message, URL: text });
        // Hapus pesan "sedang memproses" meskipun ada error
        if (processingMessageId) {
            await bot.deleteMessage(chatId, processingMessageId).catch(e => logs('warning', 'Failed to delete processing message on error', { ChatID: chatId, MessageId: processingMessageId, Error: e.message }));
        }

        let errorMessage = getLocalizedMessage(lang, 'download_failed', MESSAGES);
        if (downloadError.message.includes('Invalid URL') || downloadError.message.includes('Input validation failed')) {
            errorMessage = getLocalizedMessage(lang, 'invalid_tiktok_url', MESSAGES);
        } else if (downloadError.message.includes('Network Error') || downloadError.message.includes('timeout') || downloadError.message.includes('status code 302')) {
            errorMessage = getLocalizedMessage(lang, 'network_error', MESSAGES);
        } else if (downloadError.message.includes('Content not found') || downloadError.message.includes('video is unavailable')) {
            errorMessage = getLocalizedMessage(lang, 'content_not_found', MESSAGES);
        }
        if (!errorMessage || errorMessage.trim() === '') {
            errorMessage = getLocalizedMessage(lang, 'processing_error', MESSAGES);
        }
        await bot.sendMessage(chatId, errorMessage, { parse_mode: 'Markdown' });
      }
    } else if (text.startsWith('/')) {
      logs('info', 'Command received, delegating to command handler', { ChatID: chatId, Command: text });
      return;
    } else { // Jika bukan URL TikTok murni dan bukan perintah
      if (isPrivateChat(msg)) {
        if (isTikTokUrl) { // Ini kasus ada URL TikTok tapi ada teks lain
          await bot.sendMessage(chatId, getLocalizedMessage(lang, 'strict_link_only', MESSAGES), { parse_mode: 'Markdown' });
          logs('warning', 'Message contains extra text with TikTok URL', { ChatID: chatId, Text: text });
        } else {
          // Pesan teks biasa di private chat, kirim ke AI
          await queryAI(bot, chatId, text, lang);
        }
      } else {
        logs('info', 'Non-command/non-TikTok message in group ignored (group chat)', { ChatID: chatId, Text: text });
        return;
      }
    }
  } catch (error) {
    logs('error', 'General message handling failed', { ChatID: chatId, Error: error.message });
    if (processingMessageId) {
        await bot.deleteMessage(chatId, processingMessageId).catch(e => logs('warning', 'Failed to delete processing message on general error', { ChatID: chatId, MessageId: processingMessageId, Error: e.message }));
    }
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing_error', MESSAGES), { parse_mode: 'Markdown' });
  }
};