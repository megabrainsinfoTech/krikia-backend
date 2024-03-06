class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class AppError extends CustomAPIError {

  statusCode: number;
  isOperational: boolean;
  success: boolean;
  status: string;
  code: string = "";
  rejected: string[] = [];

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.success = false;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

export default AppError;
