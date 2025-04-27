const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const todoRoutes = require('./interfaces/routes/todo-routes');
const userRoutes = require('./interfaces/routes/user-routes');
const errorHandler = require('./interfaces/middleWares/error-handler');
const setupSwagger = require('./docs/swagger/swagger');
const config = require('./config');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', todoRoutes);
app.use('/api/v1', userRoutes);

// Swagger Documentation
setupSwagger(app);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;