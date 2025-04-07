const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const config = require('./config');

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certs/server.key')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/server.crt'))
};

const server = https.createServer(sslOptions, app);

server.listen(config.port, () => {
  console.log(`HTTPS Server running on port ${config.port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});