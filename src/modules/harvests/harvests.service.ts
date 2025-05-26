import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CACHE_KEYS, createCacheKey } from '../../shared/utils/cache-keys';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { QueryHarvestsDto } from './dto/query-harvests.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from './entities/harvest.entity';

@Injectable()
export class HarvestsService {
    constructor(
        @InjectRepository(Harvest)
        private readonly repository: Repository<Harvest>,
        private readonly sharedService: SharedService,
    ) {}

    async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
        const existingHarvest = await this.repository.findOne({
            where: { harvestName: createHarvestDto.harvestName },
        });

        if (existingHarvest) {
            throw new BadRequestException('Já existe uma organização de colheita com este nome');
        }

        const harvest = this.repository.create({
            ...createHarvestDto,
            startDate: createHarvestDto.startDate
                ? new Date(createHarvestDto.startDate)
                : undefined,
            endDate: createHarvestDto.endDate ? new Date(createHarvestDto.endDate) : undefined,
        });

        const savedHarvest = await this.repository.save(harvest);

        return savedHarvest;
    }

    async findAll(dto: QueryHarvestsDto) {
        const { harvestYear, ...paginationDto } = dto;

        return this.sharedService.paginate({
            repository: this.repository,
            searchFields: ['harvestName'],
            dto: paginationDto,
            andWhere: {
                ...(harvestYear && { harvestYear }),
            },
            queryOptions: {
                relations: ['farmCrops'],
            },
        });
    }

    async findById(id: string): Promise<Harvest> {
        const cacheKey = createCacheKey(CACHE_KEYS.harvests, 300, 'findById', id);

        const harvest = await this.repository.findOne({
            where: { id },
            relations: ['farmCrops', 'farmCrops.farm', 'farmCrops.crop'],
            cache: cacheKey,
        });

        if (!harvest) {
            throw new NotFoundException('Colheita não encontrada');
        }

        return harvest;
    }

    async update(id: string, updateHarvestDto: UpdateHarvestDto): Promise<Harvest> {
        const harvest = await this.findById(id);

        if (updateHarvestDto.harvestName) {
            const existingHarvest = await this.repository.findOne({
                where: { harvestName: updateHarvestDto.harvestName },
            });

            if (existingHarvest && existingHarvest.id !== id) {
                throw new BadRequestException('Já existe organização de colheita com este nome');
            }
        }

        const updatedHarvest = await this.repository.save({
            ...harvest,
            ...updateHarvestDto,
            ...(updateHarvestDto.startDate && { startDate: new Date(updateHarvestDto.startDate) }),
            ...(updateHarvestDto.endDate && { endDate: new Date(updateHarvestDto.endDate) }),
        });

        return updatedHarvest;
    }

    async remove(id: string): Promise<void> {
        await this.findById(id);
        await this.repository.softDelete(id);
    }
}
