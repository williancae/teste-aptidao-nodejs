import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { QueryCropsDto } from './dto/query-crops.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    softDelete: jest.fn(),
};

const mockSharedService = {
    paginate: jest.fn(),
};

const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

describe('CropsService', () => {
    let service: CropsService;
    let repository: Repository<Crop>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CropsService,
                {
                    provide: getRepositoryToken(Crop),
                    useValue: mockRepository,
                },
                {
                    provide: SharedService,
                    useValue: mockSharedService,
                },
            ],
        }).compile();

        service = module.get<CropsService>(CropsService);
        repository = module.get<Repository<Crop>>(getRepositoryToken(Crop));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        const createCropDto: CreateCropDto = {
            cropName: 'Soja',
            description: 'Soja transgênica',
        };

        it('should create a crop successfully', async () => {
            const expectedCrop = {
                id: 'uuid',
                cropName: 'Soja',
                description: 'Soja transgênica',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(expectedCrop);
            mockRepository.save.mockResolvedValue(expectedCrop);

            const result = await service.create(createCropDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { cropName: 'Soja' },
            });
            expect(mockRepository.create).toHaveBeenCalledWith(createCropDto);
            expect(result).toEqual(expectedCrop);
        });

        it('should throw BadRequestException when crop already exists', async () => {
            const existingCrop = { id: 'existing-uuid', cropName: 'Soja' };
            mockRepository.findOne.mockResolvedValue(existingCrop);

            await expect(service.create(createCropDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return paginated crops', async () => {
            const queryDto: QueryCropsDto = { skip: 0, take: 10 };
            const expectedResult = {
                data: [{ id: 'uuid', cropName: 'Soja' }],
                count: 1,
            };

            mockSharedService.paginate.mockResolvedValue(expectedResult);

            const result = await service.findAll(queryDto);

            expect(mockSharedService.paginate).toHaveBeenCalledWith({
                repository: mockRepository,
                searchFields: ['cropName', 'description'],
                dto: queryDto,
                queryOptions: {
                    relations: ['farmCrops'],
                },
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findById', () => {
        it('should return a crop when found', async () => {
            const expectedCrop = {
                id: 'uuid',
                cropName: 'Soja',
                description: 'Soja transgênica',
            };

            mockRepository.findOne.mockResolvedValue(expectedCrop);

            const result = await service.findById('uuid');

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'uuid' },
                relations: ['farmCrops', 'farmCrops.farm', 'farmCrops.harvest'],
                cache: expect.any(Object),
            });
            expect(result).toEqual(expectedCrop);
        });

        it('should throw NotFoundException when crop not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findById('non-existing-uuid')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update crop successfully', async () => {
            const updateCropDto: UpdateCropDto = {
                description: 'Soja transgênica atualizada',
            };

            const existingCrop = {
                id: 'uuid',
                cropName: 'Soja',
                description: 'Soja transgênica',
            };

            const updatedCrop = {
                ...existingCrop,
                ...updateCropDto,
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingCrop as any);
            mockRepository.save.mockResolvedValue(updatedCrop);

            const result = await service.update('uuid', updateCropDto);

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.save).toHaveBeenCalledWith({
                ...existingCrop,
                ...updateCropDto,
            });
            expect(result).toEqual(updatedCrop);
        });

        it('should throw BadRequestException when updating to existing crop name', async () => {
            const updateCropDto: UpdateCropDto = {
                cropName: 'Milho',
            };

            const existingCrop = {
                id: 'uuid',
                cropName: 'Soja',
            };

            const conflictingCrop = {
                id: 'other-uuid',
                cropName: 'Milho',
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingCrop as any);
            mockRepository.findOne.mockResolvedValue(conflictingCrop);

            await expect(service.update('uuid', updateCropDto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('remove', () => {
        it('should remove crop successfully', async () => {
            const existingCrop = {
                id: 'uuid',
                cropName: 'Soja',
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingCrop as any);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.remove('uuid');

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.softDelete).toHaveBeenCalledWith('uuid');
        });
    });

    describe('getCropStats', () => {
        it('should return crop statistics', async () => {
            const mockFarmCrops = [{ plantedArea: 100 }, { plantedArea: 150 }];

            const mockCrops = [
                {
                    id: 'uuid1',
                    cropName: 'Soja',
                    farmCrops: mockFarmCrops,
                },
                {
                    id: 'uuid2',
                    cropName: 'Milho',
                    farmCrops: [],
                },
            ];

            mockRepository.find.mockResolvedValue(mockCrops);

            const result = await service.getCropStats();

            expect(result).toEqual([
                {
                    cropName: 'Soja',
                    count: 2,
                    totalArea: 250,
                },
                {
                    cropName: 'Milho',
                    count: 0,
                    totalArea: 0,
                },
            ]);
        });
    });
});
