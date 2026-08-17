// Not Found Route Handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Central Error Handler
const errorHandler = (err, req, res, next) => {
  // 200 OK হয়ে থাকলে তাকে 500 Server Error বানাবো
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Production এ stack hide থাকবে, development এ শো করবে
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };