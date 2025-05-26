import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmAreaValidation } from '../../common/validators/farm-area.validator';
import { ProducerExistsValidation } from '../../common/validators/producer-exists.validator';
import { SharedModule } from '../../shared/shared.module';
import { Producer } from '../producers/entities/producer.entity';
import { ProducersModule } from '../producers/producers.module';
import { Farm } from './entities/farm.entity';

import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Farm, Producer]),
    SharedModule,
    ProducersModule,
  ],
  controllers: [FarmsController],
  providers: [
    FarmsService,
    FarmAreaValidation,
    ProducerExistsValidation,
  ],
  exports: [FarmsService],
})
export class FarmsModule {}
