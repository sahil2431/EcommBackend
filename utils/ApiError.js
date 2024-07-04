class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    success = false 
  ) {
    super(message);
    (this.statusCode = statusCode),
    (this.message = message),
    (this.errors = errors);
  }
}

module.exports = {ApiError}
