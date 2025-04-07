const sendResponse = (res, statusCode, data = null, message = '') => {
    res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data
    });
  };
  
  module.exports = { sendResponse };