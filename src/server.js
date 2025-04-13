const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const app = require('./app');
const dbService = require('./infrastructure/database/db');

async function startServer() {
  try {
    // Create and connect database service (highest priority)
    await dbService.connect();

    // Set up HTTPS server
    const sslOptions = {
      key: fs.readFileSync(path.join(__dirname, '../certs/server.key')),
      cert: fs.readFileSync(path.join(__dirname, '../certs/server.crt'))
    };

    const server = https.createServer(sslOptions, app);
    server.listen(config.port, () => {
      console.log(`HTTPS Server running on port ${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, closing server...');
      server.close(async () => {
        await dbService.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();