import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemoveKeysInterceptor implements NestInterceptor {
  constructor(private keysToRemove: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          context.getType() === 'http' &&
          context.switchToHttp().getResponse()
        ) {
          // If it's an HTTP request and there's a response object
          const response = context.switchToHttp().getResponse();
          if (response.statusCode < 400) {
            // Check if response status is not an error
            this.removeKeys(data); // Remove keys from the data
          }
        }
        return data;
      }),
    );
  }

  removeKeys(data: any): void {
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        for (const item of data) {
          this.removeKeys(item); // Recursively remove keys from each item in the array
        }
      } else {
        for (const key of Object.keys(data)) {
          if (this.keysToRemove.includes(key)) {
            delete data[key]; // Remove the key if it's in the keysToRemove array
          } else {
            this.removeKeys(data[key]); // Recursively remove keys from nested objects
          }
        }
      }
    }
  }
}
