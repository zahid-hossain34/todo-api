const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const todoRoutes = require('./interfaces/http/routes/todo-routes');
const errorHandler = require('./interfaces/http/middleWares/error-handler');
const config = require('./config');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', todoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;