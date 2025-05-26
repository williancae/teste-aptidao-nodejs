import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { Farm } from '../../modules/farms/entities/farm.entity';

@ValidatorConstraint({ name: 'farmExists', async: true })
@Injectable()
export class FarmExistsValidation implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
  ) {}

  async validate(farmId: string, args: ValidationArguments) {
    if (!farmId) return false;

    const farm = await this.farmRepository.findOne({
      where: { id: farmId },
    });

    return !!farm;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Farm not found';
  }
}
