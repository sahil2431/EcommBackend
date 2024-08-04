class ApiError extends Error {
  constructor(statusCode, message, errors = [], data = null , success = false) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
  }

}
module.exports = { ApiError };
