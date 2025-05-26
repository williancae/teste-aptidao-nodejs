import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { FarmCrop } from '../../modules/farm-crops/entities/farm-crop.entity';

@ValidatorConstraint({ name: 'uniqueFarmCrop', async: true })
@Injectable()
export class UniqueFarmCropValidation implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(FarmCrop)
        private readonly farmCropRepository: Repository<FarmCrop>,
    ) {}

    async validate(value: any, args: ValidationArguments) {
        const object = args.object as any;
        const { farmId, cropId, harvestId } = object;

        if (!farmId || !cropId || !harvestId) return true;

        const existing = await this.farmCropRepository.findOne({
            where: { farmId, cropId, harvestId },
        });

        const excludeId = args.constraints?.[0];
        if (existing && excludeId && existing.id === excludeId) {
            return true;
        }

        return !existing;
    }

    defaultMessage(args: ValidationArguments) {
        return 'This crop is already planted in this farm for this harvest';
    }
}
