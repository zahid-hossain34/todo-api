const { sendResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.stack}`);
  sendResponse(res, 500, null, `Server error: ${err.message}`);
};

module.exports = errorHandler;