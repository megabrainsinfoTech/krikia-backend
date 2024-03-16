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
  constructor(private readonly keysToRemove: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removeKeysFromObject(data)));
  }

  private removeKeysFromObject(obj: any): any {
    if (obj && typeof obj === 'object') {
      for (const key of this.keysToRemove) {
        if (obj.hasOwnProperty(key)) {
          delete obj[key];
        }
      }
      // Recursively remove keys from nested objects
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object') {
          obj[prop] = this.removeKeysFromObject(obj[prop]);
        }
      }
    }
    return obj;
  }
}
