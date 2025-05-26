import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Repository } from 'typeorm';
import { Producer } from '../../modules/producers/entities/producer.entity';

@ValidatorConstraint({ name: 'producerExists', async: true })
@Injectable()
export class ProducerExistsValidation implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async validate(producerId: string, args: ValidationArguments) {
    if (!producerId) return false;

    const producer = await this.producerRepository.findOne({
      where: { id: producerId },
    });

    return !!producer;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Producer not found';
  }
}
