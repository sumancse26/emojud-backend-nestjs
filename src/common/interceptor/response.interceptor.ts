import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response_code = context.switchToHttp()?.getResponse()?.statusCode;
    return next.handle().pipe(
      map((data) => {
        // Return strings (like HTML welcome page) and buffers directly
        if (typeof data === 'string' || Buffer.isBuffer(data)) {
          return data;
        }

        if (data === null || data === undefined) {
          return {
            success: true,
            response_code,
          };
        }

        return {
          success: true,
          response_code,
          ...data,
        };
      }),
    );
  }
}
