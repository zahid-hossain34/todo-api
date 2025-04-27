const { verifyToken } = require('../../utils/jwt');
const { sendResponse } = require('../../utils/apiResponse');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, null, 'Authorization header missing or invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    return sendResponse(res, 401, null, error.message);
  }
}

module.exports = authMiddleware;