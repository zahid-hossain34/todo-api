const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error', data: null });
  };
  
  module.exports = errorHandler;