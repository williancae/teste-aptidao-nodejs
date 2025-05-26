import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
    constructor(private configService: ConfigService) {}

    async createCacheOptions(): Promise<CacheModuleOptions> {
        return {
            store: await redisStore({
                host: this.configService.get<string>('CACHE_HOST', 'localhost'),
                port: this.configService.get<number>('CACHE_PORT', 6379),
                username: this.configService.get<string>('CACHE_USERNAME'),
                password: this.configService.get<string>('CACHE_PASSWORD'),
                ...(this.configService.get<string>('NODE_ENV') === 'production' && {
                    tls: {},
                }),
            }),
            ttl: 5 * 60 * 1000,
        };
    }
}
