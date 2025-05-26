import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CACHE_KEYS, createCacheKey } from '../../shared/utils/cache-keys';
import { formatCpfCnpj } from '../../shared/utils/validation.utils';
import { CreateProducerDto } from './dto/create-producer.dto';
import { QueryProducersDto } from './dto/query-producers.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';

@Injectable()
export class ProducersService {
    constructor(
        @InjectRepository(Producer)
        private readonly repository: Repository<Producer>,
        private readonly sharedService: SharedService,
    ) {}

    async create(createProducerDto: CreateProducerDto): Promise<Producer> {
        const { cpfCnpj, producerName } = createProducerDto;

        const existingProducer = await this.repository.findOne({
            where: { cpfCnpj },
        });

        if (existingProducer) {
            throw new BadRequestException('Já existe um produtor com este CPF/CNPJ');
        }

        const producer = this.repository.create({
            cpfCnpj,
            producerName,
        });

        const savedProducer = await this.repository.save(producer);

        return savedProducer;
    }

    async findAll(dto: QueryProducersDto) {
        const { state, city, ...paginationDto } = dto;

        return this.sharedService.paginate({
            repository: this.repository,
            searchFields: ['producerName', 'cpfCnpj'],
            dto: paginationDto,
            andWhere: {
                ...(state && { farms: { state } }),
                ...(city && { farms: { city } }),
            },
            queryOptions: {
                relations: ['farms'],
            },
        });
    }

    async findById(id: string): Promise<Producer> {
        const cacheKey = createCacheKey(CACHE_KEYS.producers, 300, 'findById', id);

        const producer = await this.repository.findOne({
            where: { id },
            relations: [
                'farms',
                'farms.farmCrops',
                'farms.farmCrops.crop',
                'farms.farmCrops.harvest',
            ],
            cache: cacheKey,
        });

        if (!producer) {
            throw new NotFoundException('Produtor não encontrado');
        }

        producer.cpfCnpj = formatCpfCnpj(producer.cpfCnpj);

        return producer;
    }

    async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
        const producer = await this.findById(id);

        if (updateProducerDto.cpfCnpj && updateProducerDto.cpfCnpj !== producer.cpfCnpj) {
            const existingProducer = await this.repository.findOne({
                where: { cpfCnpj: updateProducerDto.cpfCnpj },
            });

            if (existingProducer && existingProducer.id !== id) {
                throw new BadRequestException('Já existe um produtor com este CPF/CNPJ');
            }
        }

        const updatedProducer = await this.repository.save({
            ...producer,
            ...updateProducerDto,
        });

        return updatedProducer;
    }

    async remove(id: string): Promise<void> {
        await this.findById(id);
        await this.repository.softDelete(id);
    }

    async count(): Promise<number> {
        return this.repository.count();
    }
}
