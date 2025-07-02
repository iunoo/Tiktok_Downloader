# IUNO - TikTok Downloader Bot (Telegram)

Selamat datang di **IUNO**, bot Telegram canggih yang dirancang untuk mempermudah unduhan konten TikTok favorit Anda!  
Dengan IUNO, Anda bisa mendapatkan video, foto, dan audio TikTok langsung dari Telegram, **tanpa watermark**, dan kini didukung oleh **asisten AI yang responsif**.

Bot ini merupakan pengembangan dari proyek sumber terbuka, dengan fokus pada **modularitas**, **performa**, dan **pengalaman pengguna** yang ditingkatkan.

---

## ✨ Fitur Unggulan

- **Unduhan TikTok Tanpa Watermark**  
  Dapatkan video dan foto TikTok yang bersih tanpa logo mengganggu.

- **Audio Extractor**  
  Ekstrak audio dari video TikTok dan unduh sebagai file MP3.

- **Dukungan Slideshow / Multi-Photo**  
  Unduh seluruh koleksi foto dari TikTok dalam satu langkah.

- **Asisten AI Cerdas**  
  Ajukan pertanyaan tentang bot, TikTok, atau hal relevan lainnya di obrolan pribadi.  
  Didukung oleh **Groq AI** untuk respons super cepat!

- **Antarmuka Multi-Bahasa**  
  Tersedia dalam Bahasa Indonesia dan Bahasa Inggris dengan pesan ramah dan jelas.

- **Desain Modular**  
  Kode terorganisir rapi, mudah dikelola, dan siap untuk pengembangan lebih lanjut.

- **Respons Cepat**  
  Dirancang untuk memproses permintaan Anda secepat mungkin.

---

## 🚀 Coba Sekarang!

Anda bisa mencoba bot ini langsung di Telegram:  
**[@iuno_tiktok_bot]([https://t.me/iuno_tiktok_bot](https://t.me/iunoDownloadSocmed_bot))**  
> *(Ganti dengan tautan bot Telegram Anda setelah deploy)*

---

## 🧑‍💻 Instalasi & Penggunaan (Untuk Developer)

### 1. Persiapan Awal

#### Kloning Repositori
```bash
git clone https://github.com/iunoo/Tiktok_Downloader.git
cd Tiktok_Downloader
```

#### Instal Dependensi
```bash
npm install
```

#### Siapkan File Konfigurasi `.env`
1. Buat file `.env` di direktori root.
2. Salin isi dari `.env.example` ke `.env`.
3. Isi variabel berikut:

```env
BOT_TOKEN=GANTI_DENGAN_TOKEN_BOT_ANDA
PORT=3000
AI_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=GANTI_DENGAN_API_KEY_GROQ_ANDA
GROQ_MODEL_NAME=compound-beta-mini # atau model Groq lain (misal: llama3-8b-8192)
AI_SYSTEM_PROMPT=[Gunakan prompt AI Anda yang sudah disesuaikan, atau biarkan default di app_config.js]
```

> Catatan: `AI_SYSTEM_PROMPT` bisa disesuaikan langsung di `.env` atau biarkan kosong untuk menggunakan default di `config/app_config.js`.

---

### 2. Menjalankan Bot

Setelah konfigurasi `.env` selesai, jalankan bot dengan:

```bash
node start.js
```

Bot Anda sekarang akan aktif dan siap menerima perintah Telegram serta melayani permintaan unduhan!

---

## 🤖 Cara Menggunakan Bot

1. **Mulai Chat**  
   Buka Telegram dan mulai chat dengan bot Anda.

2. **Kirim Tautan TikTok**  
   Cukup kirimkan tautan TikTok (video, foto, atau slideshow) langsung ke bot.  
   Pastikan tautan diawali dengan `https://` dan tidak ada teks lain di pesan Anda.

   **Contoh:**  
   `https://vt.tiktok.com/ZSBj4tjFG/`

3. **Bot Memproses**  
   Bot akan memproses tautan, mengunduh konten, dan mengirimkannya kembali kepada Anda.

4. **Fitur AI**  
   Di obrolan pribadi, Anda juga bisa bertanya kepada bot tentang cara penggunaan, fitur TikTok, atau pertanyaan umum.  
   Bot akan merespons menggunakan AI.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.
