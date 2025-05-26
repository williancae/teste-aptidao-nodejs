import { PartialType } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { PlantedAreaValidation } from '../../../common/validators/planted-area.validator';
import { UniqueFarmCropValidation } from '../../../common/validators/unique-farm-crop.validator';
import { CreateFarmCropDto } from './create-farm-crop.dto';

export class UpdateFarmCropDto extends PartialType(CreateFarmCropDto) {
    @Validate(UniqueFarmCropValidation)
    _uniqueValidation?: any;

    @Validate(PlantedAreaValidation)
    _plantedAreaValidation?: any;

    id?: string;
}
