import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropExistsValidation } from '../../common/validators/crop-exists.validator';
import { FarmExistsValidation } from '../../common/validators/farm-exists.validator';
import { HarvestExistsValidation } from '../../common/validators/harvest-exists.validator';
import { PlantedAreaValidation } from '../../common/validators/planted-area.validator';
import { UniqueFarmCropValidation } from '../../common/validators/unique-farm-crop.validator';
import { SharedModule } from '../../shared/shared.module';
import { CropsModule } from '../crops/crops.module';
import { Crop } from '../crops/entities/crop.entity';
import { Farm } from '../farms/entities/farm.entity';
import { FarmsModule } from '../farms/farms.module';
import { Harvest } from '../harvests/entities/harvest.entity';
import { HarvestsModule } from '../harvests/harvests.module';
import { FarmCrop } from './entities/farm-crop.entity';
import { FarmCropsController } from './farm-crops.controller';
import { FarmCropsService } from './farm-crops.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FarmCrop, Farm, Crop, Harvest]),
    SharedModule,
    FarmsModule,
    CropsModule,
    HarvestsModule,
  ],
  controllers: [FarmCropsController],
  providers: [
    FarmCropsService,
    FarmExistsValidation,
    CropExistsValidation,
    HarvestExistsValidation,
    PlantedAreaValidation,
    UniqueFarmCropValidation,
  ],
  exports: [FarmCropsService],
})
export class FarmCropsModule {}
