import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CACHE_KEYS, createCacheKey } from '../../shared/utils/cache-keys';
import { ProducersService } from '../producers/producers.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { QueryFarmsDto } from './dto/query-farms.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';

@Injectable()
export class FarmsService {
    constructor(
        @InjectRepository(Farm)
        private readonly repository: Repository<Farm>,
        private readonly producersService: ProducersService,
        private readonly sharedService: SharedService,
    ) {}

    async create(createFarmDto: CreateFarmDto): Promise<Farm> {
        await this.producersService.findById(createFarmDto.producerId);

        const farm = await this.repository.create(createFarmDto);
        const savedFarm = await this.repository.save(farm);

        return savedFarm;
    }

    async findAll(dto: QueryFarmsDto) {
        const { producerId, state, city, ...paginationDto } = dto;

        return this.sharedService.paginate({
            repository: this.repository,
            searchFields: ['farmName', 'city', 'state'],
            dto: paginationDto,
            andWhere: {
                ...(producerId && { producerId }),
                ...(state && { state }),
                ...(city && { city }),
            },
            queryOptions: {
                relations: ['producer', 'farmCrops', 'farmCrops.crop', 'farmCrops.harvest'],
            },
        });
    }

    async findById(id: string): Promise<Farm> {
        const cacheKey = createCacheKey(CACHE_KEYS.farms, 300, 'findById', id);

        const farm = await this.repository.findOne({
            where: { id },
            relations: ['producer', 'farmCrops', 'farmCrops.crop', 'farmCrops.harvest'],
            cache: cacheKey,
        });

        if (!farm) {
            throw new NotFoundException('Fazenda não encontrada');
        }

        return farm;
    }

    async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
        const farm = await this.findById(id);

        if (updateFarmDto.producerId && updateFarmDto.producerId !== farm.producerId) {
            await this.producersService.findById(updateFarmDto.producerId);
        }

        const updatedFarm = await this.repository.save({
            ...farm,
            ...updateFarmDto,
        });

        return updatedFarm;
    }

    async remove(id: string): Promise<void> {
        await this.findById(id);
        await this.repository.softDelete(id);
    }

    async count(): Promise<number> {
        return this.repository.count();
    }

    async getTotalHectares(): Promise<number> {
        const farms = await this.repository.find({
            select: ['totalArea'],
        });

        return farms.reduce((total, farm) => total + Number(farm.totalArea), 0);
    }

    async getFarmsByState(): Promise<Array<{ state: string; count: number }>> {
        const farms = await this.repository.find({
            select: ['state'],
        });

        const stateCount = farms.reduce(
            (acc, farm) => {
                acc[farm.state] = (acc[farm.state] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return Object.entries(stateCount)
            .map(([state, count]) => ({ state, count }))
            .sort((a, b) => b.count - a.count);
    }

    async getLandUseStats(): Promise<Array<{ type: string; area: number }>> {
        const farms = await this.repository.find({
            select: ['agriculturableArea', 'vegetationArea'],
        });

        const totalAgriculturable = farms.reduce(
            (total, farm) => total + Number(farm.agriculturableArea),
            0,
        );
        const totalVegetation = farms.reduce(
            (total, farm) => total + Number(farm.vegetationArea),
            0,
        );

        return [
            {
                type: 'Agriculturable',
                area: totalAgriculturable,
            },
            {
                type: 'Vegetation',
                area: totalVegetation,
            },
        ];
    }
}
