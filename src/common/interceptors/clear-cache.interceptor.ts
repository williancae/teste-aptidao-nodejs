import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../../shared/services/cache.service';

  @Injectable()
  export class ClearCacheInterceptor implements NestInterceptor {
    constructor(private readonly cacheService: CacheService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const method = request.method;
      const url = request.url;

      const match = url.match(/^\/api\/([^\/]+)/);
      const moduleKey = match ? match[1] : null;

      if (moduleKey && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
        const cacheKey = `${moduleKey}`;
        return next.handle().pipe(
          tap(async () => {
            await this.cacheService.deleteByPrefix(cacheKey);
          }),
        );
      }

      return next.handle();
    }
  }