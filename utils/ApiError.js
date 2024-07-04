class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    success = false,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { ApiError };
