import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            url: this.configService.get<string>('DATABASE_URL'),
            host: this.configService.get<string>('DATABASE_HOST', 'localhost'),
            port: this.configService.get<number>('DATABASE_PORT', 5432),
            username: this.configService.get<string>('DATABASE_USERNAME', 'postgres'),
            password: this.configService.get<string>('DATABASE_PASSWORD', 'postgres'),
            database: this.configService.get<string>('DATABASE_NAME', 'brain_agriculture'),
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
            synchronize: this.configService.get<string>('NODE_ENV') === 'development',
            cache: {
                type: 'ioredis',
                options: {
                    host: this.configService.get<string>('CACHE_HOST', 'localhost'),
                    port: this.configService.get<number>('CACHE_PORT', 6379),
                    username: this.configService.get<string>('CACHE_USERNAME'),
                    password: this.configService.get<string>('CACHE_PASSWORD'),
                    ...(this.configService.get<string>('NODE_ENV') === 'production' && {
                        tls: {},
                    }),
                },
            },
        };
    }
}
