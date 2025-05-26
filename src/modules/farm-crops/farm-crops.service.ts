import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CACHE_KEYS, createCacheKey } from '../../shared/utils/cache-keys';
import { CreateFarmCropDto } from './dto/create-farm-crop.dto';
import { QueryFarmCropsDto } from './dto/query-farm-crops.dto';
import { UpdateFarmCropDto } from './dto/update-farm-crop.dto';
import { FarmCrop } from './entities/farm-crop.entity';

@Injectable()
export class FarmCropsService {
    constructor(
        @InjectRepository(FarmCrop)
        private readonly repository: Repository<FarmCrop>,
        private readonly sharedService: SharedService,
    ) {}

    async create(createFarmCropDto: CreateFarmCropDto): Promise<FarmCrop> {
        const farmCrop = this.repository.create(createFarmCropDto);
        const savedFarmCrop = await this.repository.save(farmCrop);

        return savedFarmCrop;
    }

    async findAll(dto: QueryFarmCropsDto): Promise<{ data: FarmCrop[]; count: number }> {
        const { farmId, cropId, harvestId, ...paginationDto } = dto;

        const filters = this.sharedService.buildSimpleWhere({
            farmId,
            cropId,
            harvestId,
        });

        return this.sharedService.paginate<FarmCrop>({
            repository: this.repository,
            searchFields: [],
            dto: paginationDto,
            andWhere: filters,
            queryOptions: {
                relations: ['farm', 'crop', 'harvest'],
            },
        });
    }

    async findById(id: string): Promise<FarmCrop> {
        const cacheKey = createCacheKey(CACHE_KEYS.farmCrops, 300, 'findById', id);

        const farmCrop = await this.repository.findOne({
            where: { id },
            relations: ['farm', 'farm.producer', 'crop', 'harvest'],
            cache: cacheKey,
        });

        if (!farmCrop) {
            throw new NotFoundException('Safra de fazenda não encontrada');
        }

        return farmCrop;
    }

    async update(id: string, updateFarmCropDto: UpdateFarmCropDto): Promise<FarmCrop> {
        const farmCrop = await this.findById(id);

        const dtoWithId = { ...updateFarmCropDto, id };

        const updatedFarmCrop = await this.repository.save({
            ...farmCrop,
            ...dtoWithId,
        });

        return updatedFarmCrop;
    }

    async remove(id: string): Promise<void> {
        await this.findById(id);
        await this.repository.softDelete(id);
    }

    async getFarmCropsByFarm(farmId: string): Promise<FarmCrop[]> {
        const cacheKey = createCacheKey(CACHE_KEYS.farmCrops, 300, 'getFarmCropsByFarm', farmId);

        return this.repository.find({
            where: { farmId },
            relations: ['crop', 'harvest'],
            cache: cacheKey,
        });
    }

    async getFarmCropsByHarvest(harvestId: string): Promise<FarmCrop[]> {
        const cacheKey = createCacheKey(
            CACHE_KEYS.farmCrops,
            300,
            'getFarmCropsByHarvest',
            harvestId,
        );

        return this.repository.find({
            where: { harvestId },
            relations: ['farm', 'crop'],
            cache: cacheKey,
        });
    }
}
