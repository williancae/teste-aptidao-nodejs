import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClearCacheInterceptor } from './common/interceptors/clear-cache.interceptor';
import { CacheConfigService } from './config/cache/cache.config';
import { DatabaseConfigService } from './config/database/database.config';

import { CropsModule } from './modules/crops/crops.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FarmCropsModule } from './modules/farm-crops/farm-crops.module';
import { FarmsModule } from './modules/farms/farms.module';
import { HarvestsModule } from './modules/harvests/harvests.module';
import { ProducersModule } from './modules/producers/producers.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),

        CacheModule.registerAsync({
            useClass: CacheConfigService,
            isGlobal: true,
        }),

        SharedModule,
        ProducersModule,
        FarmsModule,
        CropsModule,
        HarvestsModule,
        FarmCropsModule,
        DashboardModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClearCacheInterceptor,
        },
    ],
})
export class AppModule {}
