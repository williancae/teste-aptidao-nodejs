import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CACHE_KEYS, createCacheKey } from '../../shared/utils/cache-keys';

import { CreateCropDto } from './dto/create-crop.dto';
import { QueryCropsDto } from './dto/query-crops.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

@Injectable()
export class CropsService {
    constructor(
        @InjectRepository(Crop)
        private readonly repository: Repository<Crop>,
        private readonly sharedService: SharedService,
    ) {}

    async create(createCropDto: CreateCropDto): Promise<Crop> {
        const existingCrop = await this.repository.findOne({
            where: { cropName: createCropDto.cropName },
        });

        if (existingCrop) {
            throw new BadRequestException('Já existe uma safra com este nome');
        }

        const crop = this.repository.create(createCropDto);
        const savedCrop = await this.repository.save(crop);

        return savedCrop;
    }

    async findAll(dto: QueryCropsDto) {
        return this.sharedService.paginate({
            repository: this.repository,
            searchFields: ['cropName', 'description'],
            dto,
            queryOptions: {
                relations: ['farmCrops'],
            },
        });
    }

    async findById(id: string): Promise<Crop> {
        const cacheKey = createCacheKey(CACHE_KEYS.crops, 300, 'findById', id);

        const crop = await this.repository.findOne({
            where: { id },
            relations: ['farmCrops', 'farmCrops.farm', 'farmCrops.harvest'],
            cache: cacheKey,
        });

        if (!crop) {
            throw new NotFoundException('Safra não encontrada');
        }

        return crop;
    }

    async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
        const crop = await this.findById(id);

        if (updateCropDto.cropName) {
            const existingCrop = await this.repository.findOne({
                where: { cropName: updateCropDto.cropName },
            });

            if (existingCrop && existingCrop.id !== id) {
                throw new BadRequestException('Já existe uma safra com este nome');
            }
        }

        const updatedCrop = await this.repository.save({
            ...crop,
            ...updateCropDto,
        });

        return updatedCrop;
    }

    async remove(id: string): Promise<void> {
        await this.findById(id);
        await this.repository.softDelete(id);
    }

    async getCropStats(): Promise<Array<{ cropName: string; count: number; totalArea: number }>> {
        const crops = await this.repository.find({
            relations: ['farmCrops'],
        });

        return crops
            .map(crop => {
                const count = crop.farmCrops?.length || 0;
                const totalArea =
                    crop.farmCrops?.reduce(
                        (sum, farmCrop) => sum + (Number(farmCrop.plantedArea) || 0),
                        0,
                    ) || 0;

                return {
                    cropName: crop.cropName,
                    count,
                    totalArea,
                };
            })
            .sort((a, b) => b.count - a.count);
    }
}
