import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestDateValidation } from '../../common/validators/harvest-date.validator';
import { SharedModule } from '../../shared/shared.module';
import { Harvest } from './entities/harvest.entity';
import { HarvestsController } from './harvests.controller';
import { HarvestsService } from './harvests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Harvest]),
    SharedModule,
  ],
  controllers: [HarvestsController],
  providers: [
    HarvestsService,
    HarvestDateValidation,
  ],
  exports: [HarvestsService],
})
export class HarvestsModule {}
