const jwt = require('jsonwebtoken');
const config = require('../config/');

function signToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = { signToken, verifyToken };