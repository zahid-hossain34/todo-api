const sendResponse = (res, statusCode, data = null, message = '', page = null, limit = null, total = null) => {
  const response = {
    success: statusCode < 400,
    message,
    data
  };
  
  // Add pagination fields only if provided
  if (page !== null) response.page = page;
  if (limit !== null) response.limit = limit;
  if (total !== null) response.total = total;

  res.status(statusCode).json(response);
};

module.exports = { sendResponse };