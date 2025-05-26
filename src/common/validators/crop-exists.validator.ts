import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { Crop } from '../../modules/crops/entities/crop.entity';

@ValidatorConstraint({ name: 'cropExists', async: true })
@Injectable()
export class CropExistsValidation implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async validate(cropId: string, args: ValidationArguments) {
    if (!cropId) return false;

    const crop = await this.cropRepository.findOne({
      where: { id: cropId },
    });

    return !!crop;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Crop not found';
  }
}
