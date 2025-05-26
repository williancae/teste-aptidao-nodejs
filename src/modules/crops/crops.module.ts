import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../shared/shared.module';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';
import { Crop } from './entities/crop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crop]),
    SharedModule,
  ],
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService],
})
export class CropsModule {}
