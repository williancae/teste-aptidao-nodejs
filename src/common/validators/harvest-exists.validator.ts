import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { Harvest } from '../../modules/harvests/entities/harvest.entity';

@ValidatorConstraint({ name: 'harvestExists', async: true })
@Injectable()
export class HarvestExistsValidation implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
  ) {}

  async validate(harvestId: string, args: ValidationArguments) {
    if (!harvestId) return false;

    const harvest = await this.harvestRepository.findOne({
      where: { id: harvestId },
    });

    return !!harvest;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Harvest not found';
  }
}
