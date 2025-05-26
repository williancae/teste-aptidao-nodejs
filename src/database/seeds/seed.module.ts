import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Crop } from '../../modules/crops/entities/crop.entity';
import { FarmCrop } from '../../modules/farm-crops/entities/farm-crop.entity';
import { Farm } from '../../modules/farms/entities/farm.entity';
import { Harvest } from '../../modules/harvests/entities/harvest.entity';
import { Producer } from '../../modules/producers/entities/producer.entity';

import { DatabaseConfigService } from '../../config/database/database.config';
import { DatabaseSeeder } from './database.seed';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([Producer, Farm, Crop, Harvest, FarmCrop]),
    ],
    providers: [DatabaseSeeder],
    exports: [DatabaseSeeder],
})
export class SeedModule {}
