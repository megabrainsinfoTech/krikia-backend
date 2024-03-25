import { HttpException } from '@nestjs/common';

class CustomAPIError extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

/**
 * Represents an application-specific error.
 * Extends the CustomAPIError class and adds additional properties specific to application errors.
 * @example
 * // Create an instance of AppError
 * const appError = new AppError('Example error message', 404, { errorCode: 'E123', username:"John Micheal" });

*/
class AppError extends CustomAPIError {
  /**
   * HTTP status code associated with the error.
   */
  statusCode: number;

  /**
   * Indicates whether the error is operational.
   * Operational errors are expected and can be handled gracefully by the application.
   */
  isOperational: boolean;

  /**
   * Indicates whether the error represents a successful operation.
   * If the status code is less than 400, success will be true.
   */
  success: boolean;

  /**
   * Additional fields associated with the error.
   * These fields can provide additional context or information about the error.
   */
  fields?: Record<string, string>;

  /**
   * Creates a new instance of the AppError class.
   * @param message The error message.
   * @param statusCode The HTTP status code associated with the error.
   * @param extraField Additional fields associated with the error.
   */
  constructor(
    message: string,
    statusCode: number,
    extraField?: Record<string, string>,
  ) {
    super(message, statusCode);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.success = statusCode < 400;
    this.fields = extraField;
  }
}

export default AppError;
