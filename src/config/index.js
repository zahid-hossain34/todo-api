require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  // dataFile: process.env.DATA_FILE || './data/todos.json', // Optional now
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-api',
  jwtSecret: process.env.JWT_SECRET || 'not-so-secret',
};