// webserver/express_server.js
const express = require('express');
const { PORT, BOT_AUTHOR } = require('../config/app_config'); // Mengimpor PORT dan BOT_AUTHOR
const { logs } = require('../utils/common_utils'); // Mengimpor fungsi logs

// Fungsi untuk memulai server Express
function startExpressServer() {
  const app = express();

  app.get('/', (req, res) => {
    logs('info', 'Health check request received', { IP: req.ip, UserAgent: req.headers['user-agent'] });
    res.setHeader('Content-Type', 'application/json');
    const data = {
      status: 'true',
      message: 'Bot is Successfully Activated and Running!',
      author: BOT_AUTHOR // Menggunakan BOT_AUTHOR dari konfigurasi
    };
    const result = {
      response: data
    };
    res.send(JSON.stringify(result, null, 2));
  });

  function listenOnPort(port) {
    app.listen(port, () => {
      logs('success', `Server is running on port ${port}`, { Type: 'Express' });
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logs('warning', `Port ${port} is already in use. Trying another port...`, { Type: 'Express' });
        listenOnPort(port + 1); // Coba port berikutnya
      } else {
        logs('error', `Server failed to start on port ${port}`, { Error: err.message, Type: 'Express' });
      }
    });
  }

  listenOnPort(PORT);
}

module.exports = startExpressServer; // Mengekspor fungsi