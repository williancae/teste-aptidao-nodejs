import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { CropsModule } from '../crops/crops.module';
import { FarmsModule } from '../farms/farms.module';
import { ProducersModule } from '../producers/producers.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    SharedModule,
    ProducersModule,
    FarmsModule,
    CropsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
