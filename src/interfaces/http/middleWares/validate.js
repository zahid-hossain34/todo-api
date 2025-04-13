const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const validateTodo = [
  body('title')
    .if(body('title').exists())
    .isString().withMessage('Title must be a string')
    .trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description')
    .if(body('description').exists())
    .isString().withMessage('Description must be a string')
    .trim().isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  body('completed')
    .if(body('completed').exists())
    .isBoolean().withMessage('Completed must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(err => err.msg).join(', '),
        data: null
      });
    }
    if (req.method === 'POST') {
      if (!req.body.title || !req.body.description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required for POST',
          data: null
        });
      }
    }
    next();
  }
];

const validateId = [
  param('id')
    .custom(value => ObjectId.isValid(value))
    .withMessage('Invalid ID: must be a valid MongoDB ObjectId'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map(err => err.msg).join(', '),
        data: null
      });
    }
    req.validatedId = req.params.id;
    next();
  }
];

module.exports = { validateTodo, validateId };