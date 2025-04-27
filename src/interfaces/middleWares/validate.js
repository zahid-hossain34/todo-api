const { ObjectId } = require('mongodb');

function validateId(req, res, next) {
  const { id } = req.params;
  try {
    req.validatedId = new ObjectId(id);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      data: null
    });
  }
}

function validateTodo(req, res, next) {
  const { title, description, completed } = req.body;
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be a non-empty string',
        data: null
      });
    }
    if (description && typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Description must be a string',
        data: null
      });
    }
  }
  if (req.method === 'PATCH' && completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Completed must be a boolean',
      data: null
    });
  }
  next();
}

function validateUser(req, res, next) {
  const { email, password, name } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required',
      data: null
    });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      data: null
    });
  }
  if (name && typeof name !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Name must be a string',
      data: null
    });
  }
  next();
}

module.exports = { validateId, validateTodo, validateUser };