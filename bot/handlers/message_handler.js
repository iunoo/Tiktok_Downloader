// bot/handlers/message_handler.js
const axios = require('axios');
const { logs, getLocalizedMessage } = require('../../utils/common_utils');
const { getUserLanguage, getConversationHistory, setConversationHistory } = require('../../data/data_store');
const { MESSAGES, AI_API_URL, AI_SYSTEM_PROMPT, AI_CHAT_HISTORY_LIMIT, SUPPORT_TELEGRAM_URL, BOT_AUTHOR, GROQ_API_KEY, GROQ_MODEL_NAME } = require('../../config/app_config');
const tiktok_video = require('../plugins/tiktok_video');
const tiktok_photo = require('../plugins/tiktok_photo');
const { version } = require('../../package.json');

const isPrivateChat = (msg) => msg.chat.type === 'private';

const queryAI = async (bot, chatId, userMessage, lang) => {
  if (!GROQ_API_KEY) {
    logs('error', 'Groq API Key is not set.', { ChatID: chatId });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'ai_error_fallback', MESSAGES), { parse_mode: 'Markdown' });
    return;
  }

  try {
    let currentHistory = getConversationHistory(chatId) || [];
    const systemPromptContent = AI_SYSTEM_PROMPT;
    if (currentHistory.length === 0 || currentHistory[0].role !== 'system') {
      currentHistory.unshift({ role: 'system', content: systemPromptContent });
    }
    currentHistory.push({ role: 'user', content: userMessage });

    if (currentHistory.length > (AI_CHAT_HISTORY_LIMIT * 2) + 1) {
      currentHistory = [currentHistory[0], ...currentHistory.slice(-(AI_CHAT_HISTORY_LIMIT * 2))];
    }
    setConversationHistory(chatId, currentHistory);

    const response = await axios.post(
      AI_API_URL,
      { messages: currentHistory, model: GROQ_MODEL_NAME },
      { headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` } }
    );
    const ai_response = response.data.choices[0].message.content;
    currentHistory.push({ role: 'assistant', content: ai_response });
    setConversationHistory(chatId, currentHistory);
    await bot.sendMessage(chatId, ai_response, { parse_mode: 'Markdown' });
  } catch (error) {
    logs('error', 'AI API request failed', { ChatID: chatId, Error: error.message });
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'ai_error_fallback', MESSAGES), { parse_mode: 'Markdown' });
  }
};

module.exports = async (bot, msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const lang = getUserLanguage(chatId) || 'en';

  if (msg.from.is_bot) return;

  const isTikTokUrlPattern = /^https:\/\/(www\.)?(vt\.)?tiktok\.com\//;
  const isTikTokUrl = isTikTokUrlPattern.test(text.trim());

  let processingMessageId = null;

  try {
    if (isTikTokUrl && text.trim() === text) {
      // Add random emoji reaction when TikTok link is received (using only basic supported reactions)
      const reactions = ['👍', '👎', '❤️', '🔥', '🥰', '👏', '😁', '🤔', '🤯', '😱', '🤬', '😢', '🎉', '🤩', '🤮', '💩', '🙏', '👌', '🕊', '🤡', '🥱', '🥴', '😍', '🐳', '❤️‍🔥', '🌚', '🌭', '💯', '🤣', '⚡', '🍌', '🏆', '💔', '🤨', '😐', '🍓', '🍾', '💋', '🖕', '😈', '😴', '😭', '🤓', '👻', '👨‍💻', '👀', '🎃', '🙈', '😇', '😨', '🤝', '✍️', '🤗', '🫡', '🎅', '🎄', '☃️', '💅', '🤪', '🗿', '🆒', '💘', '🙉', '🦄', '😘', '💊', '🙊', '😎', '👾', '🤷‍♂️', '🤷', '🤷‍♀️', '😡'];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      
      try {
        await bot.setMessageReaction(chatId, msg.message_id, { reaction: [{ type: 'emoji', emoji: randomReaction }] });
      } catch (reactionError) {
        logs('warning', 'Failed to add reaction', { ChatID: chatId, Error: reactionError.message });
      }
      
      const sentMessage = await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing', MESSAGES), { parse_mode: 'Markdown' });
      processingMessageId = sentMessage.message_id;

      try {
        const { ttdl } = require('btch-downloader');
        const data = await ttdl(text.trim());

        // =================================================================
        // KODE SEMENTARA UNTUK MELIHAT ISI DATA DARI DOWNLOADER
        console.log('--- HASIL MENTAH DARI TIKTOK DOWNLOADER ---');
        console.log(data);
        // =================================================================

        if (!data || (!data.video && !data.audio)) {
          throw new Error('Content not found');
        }

        const isMultiPhoto = data.video && data.video.length > 1;
        const isSinglePhotoByUrl = data.video && data.video.length === 1 && (data.video[0].includes('photomode') || data.video[0].endsWith('.jpeg'));
        
        if (processingMessageId) {
            await bot.deleteMessage(chatId, processingMessageId).catch(e => logs('warning', 'Failed to delete processing message on success', { ChatID: chatId, Error: e.message }));
            processingMessageId = null; 
        }

        if (isMultiPhoto || isSinglePhotoByUrl) {
          await tiktok_photo(bot, msg, data, lang);
        } else {
          await tiktok_video(bot, msg, data, lang);
        }

      } catch (downloadError) {
        logs('error', 'Handler failed for TikTok URL', { ChatID: chatId, Error: downloadError.message, URL: text });

        if (processingMessageId) {
            await bot.deleteMessage(chatId, processingMessageId).catch(e => logs('warning', 'Failed to delete processing message on error', { ChatID: chatId, Error: e.message }));
        }

        let errorMessage = getLocalizedMessage(lang, 'download_failed', MESSAGES);
        if (downloadError.message.toLowerCase().includes('content not found')) {
            errorMessage = getLocalizedMessage(lang, 'content_not_found', MESSAGES);
        }
        await bot.sendMessage(chatId, errorMessage, { parse_mode: 'Markdown' });
      }
    } else if (text.startsWith('/')) {
      return; // Ditangani oleh command handler
    } else {
      if (isPrivateChat(msg)) {
        if (isTikTokUrl) {
          await bot.sendMessage(chatId, getLocalizedMessage(lang, 'strict_link_only', MESSAGES), { parse_mode: 'Markdown' });
        } else {
          await queryAI(bot, chatId, text, lang);
        }
      }
    }
  } catch (error) {
    logs('error', 'General message handling failed', { ChatID: chatId, Error: error.message });
    if (processingMessageId) {
        await bot.deleteMessage(chatId, processingMessageId).catch(e => logs('warning', 'Failed to delete processing message on general error', { ChatID: chatId, Error: e.message }));
    }
    await bot.sendMessage(chatId, getLocalizedMessage(lang, 'processing_error', MESSAGES), { parse_mode: 'Markdown' });
  }
};