require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  dataFile: process.env.DATA_FILE || './data/todos.json',
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000']
};