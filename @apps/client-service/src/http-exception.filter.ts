import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

class ExtendedHttpException extends HttpException {
  isOperational: boolean;
  success: boolean;
  fields?: Record<string, string>;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: ExtendedHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // if (!exception.isOperational) {
    //   console.log(exception);
    //   return response.status(status).json({
    //     statusCode: status,
    //     message:
    //       'Sorry!!! something went wrong. Please contact the krikia customer care, if the issues persist.',
    //   });
    // }

    if (!exception.isOperational) {
      return response.status(status).json(exception.getResponse());
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      isOperational: exception.isOperational,
      success: exception.success,
      fields: exception.fields,
    });
  }
}
