import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Not, Repository } from 'typeorm';
import { FarmCrop } from '../../modules/farm-crops/entities/farm-crop.entity';
import { Farm } from '../../modules/farms/entities/farm.entity';

@ValidatorConstraint({ name: 'plantedAreaValidation', async: true })
@Injectable()
export class PlantedAreaValidation implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(Farm)
        private readonly farmRepository: Repository<Farm>,
        @InjectRepository(FarmCrop)
        private readonly farmCropRepository: Repository<FarmCrop>,
    ) {}

    async validate(plantedArea: number, args: ValidationArguments) {
        if (!plantedArea) return true;

        const object = args.object as any;
        const { farmId, harvestId } = object;

        if (!farmId || !harvestId) return true;

        const farm = await this.farmRepository.findOne({
            where: { id: farmId },
            select: ['agriculturableArea'],
        });

        if (!farm) return true;

        const whereCondition: any = {
            farmId,
            harvestId,
        };

        const updateContext = args.object as any;
        if (updateContext.id) {
            whereCondition.id = Not(updateContext.id);
        }

        const existingFarmCrops = await this.farmCropRepository.find({
            where: whereCondition,
            select: ['plantedArea'],
        });

        const totalExistingArea = existingFarmCrops.reduce(
            (sum, farmCrop) => sum + (Number(farmCrop.plantedArea) || 0),
            0,
        );

        const totalPlantedArea = totalExistingArea + plantedArea;

        return totalPlantedArea <= farm.agriculturableArea;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Planted area exceeds farm agriculturable area for this harvest';
    }
}
