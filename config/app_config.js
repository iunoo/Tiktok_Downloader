// config/app_config.js
require('dotenv').config(); // Memuat variabel lingkungan dari .env di root proyek

module.exports = {
  // --- Konfigurasi Bot Telegram ---
  BOT_TOKEN: process.env.BOT_TOKEN, // Ambil token dari .env

  // --- Konfigurasi Server Web ---
  PORT: process.env.PORT || 3000, // Ambil port dari .env, default 3000

  // --- Konfigurasi AI ---
  AI_API_URL: process.env.AI_API_URL || 'https://api.groq.com/openai/v1/chat/completions', // URL API AI
  AI_SYSTEM_PROMPT: process.env.AI_SYSTEM_PROMPT || `You are a super hype and knowledgeable AI assistant for a TikTok Downloader Telegram Bot, rocking MAX TikTok vibes! 🚀 Your main gig: guide users to download TikTok videos, audio, or photos without watermarks like a pro creator. Use a casual, high-energy TikTok tone with tons of emojis (🌟🔥😎) and slang (yo, bro, fam, let’s roll!), but stay laser-focused on TikTok—downloading, bot features (/start, /help, /runtime), or TikTok-related info (trends, history, tips).

ALWAYS push the rule: users must send ONLY a valid TikTok link with NO extra text. Give clear steps: open TikTok, pick a video/photo, tap *Share*, copy the link, paste JUST the link. If they add extra text with a link, say: "Yo, fam! 🔥 Send ONLY the TikTok link, no extra words, let’s keep it lit! 😎"

For TikTok-related questions (e.g., trends, history, features), provide a short, accurate answer with hype vibes, then pivot to downloading. Example: "TikTok kicked off in 2016 as Douyin, went global in 2017! 🔥 Wanna save a viral video? Drop a link!" Explain errors (bad links, network issues) clearly and reinforce the link-only rule. Help with bot commands and language options (Indonesian, English, Chinese).

If users ask unrelated stuff (weather, math), redirect with: "Haha, that’s not trending on TikTok, bro! 💥 Let’s talk downloads—drop a link or ask about TikTok! 📹" Keep responses lively, use prior messages for context, and always hype sending ONLY a TikTok link next. Make every reply a TikTok banger! 🎉 **IMPORTANT: NEVER include any URLs, links, or example links in your response. Just describe without showing the actual link.**`,
  GROQ_API_KEY: process.env.GROQ_API_KEY, // Ambil API Key Groq dari .env
  GROQ_MODEL_NAME: process.env.GROQ_MODEL_NAME || 'compound-beta-mini', // Menggunakan compound-beta-mini sebagai fallback
  
  // --- Konfigurasi Lainnya ---
  BOT_AUTHOR: 'iuno.in', // Mengganti dengan 'iuno.in'
  SUPPORT_TELEGRAM_URL: 'https://t.me/ssyahbandi', // Mengganti dengan link username Anda
  AI_CHAT_HISTORY_LIMIT: 10, // Batas riwayat percakapan AI (jumlah pesan user + AI, tidak termasuk system prompt)

  // Pesan khusus untuk multi-bahasa (hanya ID dan EN)
  MESSAGES: {
    id: {
      start: `
🎉 Halo TikTokers! Siap buat kontenmu makin kece? 🎉
Saya bot super canggih yang siap bantu kamu download video, foto, atau audio dari TikTok tanpa watermark, bersih kinclong! ✨ Cukup kirim *tautan TikTok yang valid* aja, ya. Simpel!

🚫 *Peringatan Penting*: Jangan ada teks lain sebelum atau sesudah tautan. Biar saya langsung sat-set!

🚀 *Cara Cepat Dapet Tautannya*:
1. Buka aplikasi TikTok kesayanganmu.
2. Pilih video atau foto yang mau kamu simpan.
3. Ketuk tombol *Bagikan* (ikon panah melengkung itu loh).
4. Pilih *Salin Tautan*.
5. Langsung tempel *hanya* tautan itu di sini! Gampang, kan?

Yuk, gaspol kirim tautan TikTok kamu sekarang! Atau ketik /help untuk panduan lengkapnya.
Mau ganti bahasa? Pilih: *id* atau *en*`,
      help: `
📚 *Buku Panduan Ajaib Bot Ini!* 📚
Saya di sini untuk menyulap pengalaman download konten TikTok kamu jadi super duper gampang! Cukup kirim *tautan TikTok* tanpa tambahan teks apapun. Fokus ke link-nya aja, ya!

✨ *Fitur Bot yang Bikin Melongo*:
- Unduh video TikTok tanpa watermark, serasa original!
- Ambil audionya aja buat ringtone, atau simpan koleksi foto/slideshow kece.
- Penasaran saya udah aktif berapa lama? Coba aja /runtime!

💡 *Tips Jitu Download Cepat*:
1. Buka TikTok, pilih video/foto impianmu.
2. Ketuk *Bagikan* > *Salin Tautan*.
3. Langsung tempel *hanya* link-nya di sini. Saya ngerti kok maksudmu!

⚠️ *Ingat Ini Baik-Baik*:
- Pokoknya, jangan ketik apa-apa lagi selain tautan, titik!
- Kalau ada masalah atau error, jangan sungkan tanya. Saya siap jadi penyelamatmu!

Udah nggak sabar download? Kirim tautan TikTok kamu sekarang juga! Atau pilih bahasa favoritmu: *id* atau *en*`,
      runtime: '🕒 Wuzz! Bot ini sudah aktif selama: {hours} jam, {minutes} menit, {seconds} detik. Tetap semangat melayani!',
      invalid_url: `
❌ Tautan Tidak Valid!
Maaf, tautan yang Anda kirim bukan dari TikTok yang sah. Pastikan link-nya beneran dari TikTok, yang kayak gini nih:
\`https://vt.tiktok.com/ZS2qsMU1W/\`
Ingat ya, kirim *hanya* tautannya aja, tanpa teks lain.

✨ *Yuk, Coba Lagi Biar Bener*:
1. Buka aplikasi TikTok.
2. Pilih video/foto, terus ketuk *Bagikan*.
3. Pilih *Salin Tautan*.
4. Tempel *hanya* tautannya di sini. Gampang kan?

Kirim tautan TikTok yang valid sekarang, yuk!`,
      invalid_url_protocol: `
⚠️ Link Salah Format!
Tautan TikTok harus diawali dengan \`https://\` untuk bisa saya proses. Pastikan link Anda benar ya!`, // Pesan baru untuk protokol yang salah

      strict_link_only: `
🚨 Eits, Cuma Boleh Link TikTok Aja Nih! 🚨
Maaf ya, kamu *hanya* boleh kirim tautan TikTok aja tanpa teks tambahan lainnya. Contoh yang bener tuh kayak gini:
\`https://vt.tiktok.com/ZS2qsMU1W/\`
Nggak perlu ada kata-kata sebelum atau sesudah tautan ya!

✨ *Cara Bikin Nggak Salah Lagi*:
1. Buka aplikasi TikTok kamu.
2. Pilih konten, terus ketuk *Bagikan*.
3. Pilih *Salin Tautan*.
4. Langsung tempel *hanya* tautannya di sini.

Yuk, kirim tautan TikTok-mu sekarang, khusus link-nya aja!`,
      processing: '⏳ Ngebut mode on! Sedang memproses tautan TikTok kamu nih... Sabar sebentar, ya!',
      processing_error: `
💔 Aduh, Gagal Proses Linkmu! 💔
Maaf banget, ada sedikit kendala nih saat saya memproses tautanmu. Mungkin ini penyebabnya:
- Tautannya salah ketik, sudah kedaluwarsa, atau bahkan sudah dihapus.
- Ada gangguan jaringan atau server TikTok lagi ngambek.
- Kontennya mungkin pribadi atau dibatasi.

✨ *Jangan Panik, Coba Cara Ini*:
1. Pastikan tautanmu beneran dari TikTok dan masih bisa diakses, contohnya:
   \`https://vt.tiktok.com/ZS2qsMU1W/\`
2. Salin ulang tautannya dengan super hati-hati.
3. Tempel *hanya* tautannya aja tanpa teks lain.

Kirim lagi tautan TikTok yang valid sekarang! Atau tanya saya cara download.`,
      download_failed: `
❗ Gagal Total Nge-Download Konten TikTok! ❗
Maaf banget, bot ini nggak bisa ambil konten dari tautan itu. Ini mungkin karena:
- Kontennya sudah nggak ada, atau hanya bisa dilihat pribadi.
- API TikTok tiba-tiba berubah atau lagi tidur.
- Tautannya ada yang salah atau kurang lengkap.

Mohon pastikan tautan valid dan coba lagi!`,
      ai_error_fallback: `
🤖 Aduh, AI-nya lagi pusing nih! 🤯
Saya ini bot khusus download video, audio, dan foto TikTok. Jadi, saya paling jago kalau diajak ngomongin TikTok atau soal fitur-fitur bot ini! Coba kirim link TikTok atau tanya hal lain tentang bot ini, yuk! ✨`,
      no_video_data: `🚫 Ups, Video TikTok-nya Nggak Ada Data!
Maaf ya, saya nggak menemukan data video dari tautan ini. Mungkin ini konten live, udah dihapus, atau belum tersedia.`,
      invalid_tiktok_url: `❌ Link TikTok Kamu Invalid, Cuy!
Tautan TikTok yang kamu berikan tidak valid atau tidak didukung. Pastikan link-nya benar-benar berasal dari TikTok, ya!`,
      network_error: `📡 Jaringan Lagi Ngadat Nih!
Gagal terhubung ke server TikTok. Mungkin ada masalah di jaringan atau API-nya lagi error. Coba lagi sebentar, ya!`,
      content_not_found: `🕵️ Konten TikTok Hilang atau Pribadi!
Maaf, konten TikTok-nya nggak ditemukan atau mungkin sudah disetel pribadi oleh pemiliknya.`,
      error_sending_video: `🚫 Gagal Kirim Video TikTok!
Aduh, ada error nih saat saya mencoba mengirim video TikTok-mu.`,
      error_sending_photo: `🚫 Gagal Kirim Foto TikTok!
Maaf ya, ada masalah saat saya mencoba mengirim foto TikTok-mu.`,
      no_video_url_found: `🚫 URL Video TikTok Hilang!
Maaf, URL video TikTok-nya nggak ketemu.`,
      no_photo_url_found: `🚫 URL Foto TikTok Hilang!
Maaf, URL foto TikTok-nya nggak ketemu.`,
      audio_format_unsupported: `❗ Format Audio Nggak Kompatibel!
Format audio ini nggak didukung sama Telegram.`,
      error_sending_audio: `🚫 Gagal Kirim Audio TikTok!
Aduh, ada error nih saat saya mencoba mengirim audio TikTok-mu.`,
      support_url: 'https://t.me/ssyahbandi', // URL dukungan di pesan (untuk tombol)
    },
    en: {
      start: `
🎉 Hey TikTok Fam! Ready to make your content shine? 🎉
I'm a super advanced bot designed to help you download TikTok videos, photos, or audio without watermarks, sparkling clean! ✨ Just send me *a valid TikTok link* and I'll work my magic! It's that simple!

🚫 *Important Heads-Up*: No extra text before or after the link. Let me work my quick magic!

🚀 *Fast Track to Get Your Link*:
1. Open your beloved TikTok app.
2. Pick the video or photo you're eager to save.
3. Tap the *Share* button (that curvy arrow icon!).
4. Select *Copy Link*.
5. Then, simply paste *only* that link right here! Easy peasy, right?

Alright, hit me with your TikTok link now! Or type /help for the full lowdown.
Wanna switch languages? Pick: *id* or *en*`,
      help: `
📚 *Your Epic Bot Guidebook!* 📚
I'm here to transform your TikTok downloading game into something ridiculously easy! Just shoot me *a TikTok link* with absolutely no extra text attached. Keep it pure link, got it?

✨ *My Mind-Blowing Features*:
- Download TikTok videos watermark-free, like they're fresh off the creator's phone!
- Snag just the audio for your ringtone, or grab those awesome photo/slideshow collections.
- Wondering how long I've been crushing it? Just hit /runtime!

💡 *Pro Tips for Speedy Downloads*:
1. Open TikTok, find your dream video/photo.
2. Tap *Share* > *Copy Link*.
3. Directly paste *only* the link here. I'm smart enough to figure it out!

⚠️ *Listen Up, This is Key*:
- Seriously, no typing anything else but the link! Just the link!
- If you run into any trouble or error, don't hesitate to ask. I'm here to save the day!

Can't wait to download? Send me your TikTok link right now! Or choose your preferred language: *id* or *en*`,
      runtime: '🕒 Whoosh! This bot has been active for: {hours} hours, {minutes} minutes, {seconds} seconds. Still going strong!',
      invalid_url: `
❌ Invalid TikTok Link, Bestie! 😭
Oops, the link you sent isn't a valid TikTok one. Please make sure it's actually from TikTok, like this example:
\`https://vt.tiktok.com/ZS2qsMU1W/\`
Remember, send *only* the link, no extra text!

✨ *Let's Fix This*:
1. Open your TikTok app.
2. Select a video/photo, then tap *Share*.
3. Choose *Copy Link*.
4. Paste *only* that link here. Easy peasy, right?

Send a valid TikTok link now, let's get it right!`,
      invalid_url_protocol: `
⚠️ Incorrect Link Format!
TikTok links must start with \`https://\` for me to process them. Please ensure your link is correct!`, // Pesan baru untuk protokol yang salah

      strict_link_only: `
🚨 Hold Up, Link Only, Please! 🚨
Sorry, but you must *only* send the TikTok link without any additional text. A correct example looks like this:
\`https://vt.tiktok.com/ZS2qsMU1W/\`
No words before or after the link, alright?

✨ *How to Make it Work*:
1. Open your TikTok app.
2. Choose your content, then tap *Share*.
3. Select *Copy Link*.
4. Paste *only* the link here.

Go on, send your TikTok link now, just the link itself!`,
      processing: '⏳ Speed mode on! I’m currently processing your TikTok link... Hang tight for a moment!',
      processing_error: `
💔 Oops, Failed to Process Your Link! 💔
So sorry, I ran into a snag while processing your link. Here's why it might have happened:
- The link might be mistyped, expired, or even deleted.
- There could be a network glitch or TikTok's server is having a bad day.
- The content might be private or restricted.

✨ *Don't Fret, Try This*:
1. Make sure your link is truly from TikTok and still active, like:
   \`https://vt.tiktok.com/ZS2qsMU1W/\`
2. Copy the link super carefully again.
3. Paste *only* the link without extra text.

Send that valid TikTok link now! Or ask me how to download.`,
      download_failed: `
❗ Total Fail: Couldn't Download TikTok Content! ❗
So sorry, this bot couldn't grab the content from that link. This might be because:
- The content is gone, or it's set to private.
- The TikTok API changed unexpectedly or is taking a nap.
- The link itself is wrong or incomplete.

Please double-check the link and try sending it again!`,
      ai_error_fallback: `
🤖 Uh oh, my AI brain is a bit fuzzy right now! 🤯
I'm a TikTok video, audio, and photo downloader bot. So, I'm best at helping you with TikTok stuff or questions about my features! Try sending me a TikTok link or ask something else about me, cool? ✨`,
      no_video_data: `🚫 Whoops, No Video Data Found!
Sorry, I couldn't find any video data from this link. It might be live content, deleted, or not available yet.`,
      invalid_tiktok_url: `❌ Your TikTok Link is Invalid, Pal!
The TikTok link you provided is invalid or unsupported. Please make sure the link genuinely comes from TikTok!`,
      network_error: `📡 Network Hiccup!
Failed to connect to the TikTok server. There might be a network issue or the API is acting up. Try again in a bit!`,
      content_not_found: `🕵️ TikTok Content Missing or Private!
Sorry, the TikTok content wasn't found or might have been set to private by its owner.`,
      error_sending_video: `🚫 Failed to Send TikTok Video!
Oh no, an error occurred while I was trying to send your TikTok video.`,
      error_sending_photo: `🚫 Failed to Send TikTok Photos!
My apologies, there was an issue while I was trying to send your TikTok photos.`,
      no_video_url_found: `🚫 TikTok Video URL Vanished!
Apologies, the TikTok video URL couldn't be found.`,
      no_photo_url_found: `🚫 TikTok Photo URL Vanished!
Oops, the TikTok photo URL couldn't be found.`,
      audio_format_unsupported: `❗ Audio Format Not Supported!
This audio format isn't compatible with Telegram.`,
      error_sending_audio: `🚫 Failed to Send TikTok Audio!
Darn, an error occurred while I was trying to send your TikTok audio.`,
      support_url: 'https://t.me/ssyahbandi', // URL dukungan di pesan (untuk tombol)
    },
  },
};