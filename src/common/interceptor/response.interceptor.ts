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
      map((data) => ({
        success: true,
        response_code,
        ...data,
        // message: data.message || 'Successful',
        // data: data.data,
        // summary: data.summary ?? null,
      })),
    );
  }
}
