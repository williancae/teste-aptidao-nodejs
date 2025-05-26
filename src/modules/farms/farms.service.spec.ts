import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { ProducersService } from '../producers/producers.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { QueryFarmsDto } from './dto/query-farms.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';
import { FarmsService } from './farms.service';

const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    softDelete: jest.fn(),
    count: jest.fn(),
};

const mockSharedService = {
    paginate: jest.fn(),
};

const mockProducersService = {
    findById: jest.fn(),
};

const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

describe('FarmsService', () => {
    let service: FarmsService;
    let repository: Repository<Farm>;
    let producersService: ProducersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FarmsService,
                {
                    provide: getRepositoryToken(Farm),
                    useValue: mockRepository,
                },
                {
                    provide: SharedService,
                    useValue: mockSharedService,
                },
                {
                    provide: ProducersService,
                    useValue: mockProducersService,
                },
            ],
        }).compile();

        service = module.get<FarmsService>(FarmsService);
        repository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
        producersService = module.get<ProducersService>(ProducersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        const createFarmDto: CreateFarmDto = {
            farmName: 'Fazenda Santa Maria',
            city: 'Sorriso',
            state: 'MT',
            totalArea: 1000,
            agriculturableArea: 800,
            vegetationArea: 200,
            producerId: 'producer-uuid',
        };

        it('should create a farm successfully', async () => {
            const mockProducer = { id: 'producer-uuid', producerName: 'João' };
            const expectedFarm = {
                id: 'uuid',
                ...createFarmDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockProducersService.findById.mockResolvedValue(mockProducer);
            mockRepository.create.mockReturnValue(expectedFarm);
            mockRepository.save.mockResolvedValue(expectedFarm);

            const result = await service.create(createFarmDto);

            expect(mockProducersService.findById).toHaveBeenCalledWith('producer-uuid');
            expect(mockRepository.create).toHaveBeenCalledWith(createFarmDto);
            expect(result).toEqual(expectedFarm);
        });

        it('should throw NotFoundException when producer not found', async () => {
            mockProducersService.findById.mockRejectedValue(new NotFoundException());

            await expect(service.create(createFarmDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return paginated farms', async () => {
            const queryDto: QueryFarmsDto = { skip: 0, take: 10 };
            const expectedResult = {
                data: [{ id: 'uuid', farmName: 'Fazenda Santa Maria' }],
                count: 1,
            };

            mockSharedService.paginate.mockResolvedValue(expectedResult);

            const result = await service.findAll(queryDto);

            expect(mockSharedService.paginate).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findById', () => {
        it('should return a farm when found', async () => {
            const expectedFarm = {
                id: 'uuid',
                farmName: 'Fazenda Santa Maria',
                city: 'Sorriso',
                state: 'MT',
            };

            mockRepository.findOne.mockResolvedValue(expectedFarm);

            const result = await service.findById('uuid');

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'uuid' },
                relations: ['producer', 'farmCrops', 'farmCrops.crop', 'farmCrops.harvest'],
                cache: expect.any(Object),
            });
            expect(result).toEqual(expectedFarm);
        });

        it('should throw NotFoundException when farm not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findById('non-existing-uuid')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update farm successfully', async () => {
            const updateFarmDto: UpdateFarmDto = {
                farmName: 'Fazenda Santa Maria Atualizada',
            };

            const existingFarm = {
                id: 'uuid',
                farmName: 'Fazenda Santa Maria',
                producerId: 'producer-uuid',
            };

            const updatedFarm = {
                ...existingFarm,
                ...updateFarmDto,
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingFarm as any);
            mockRepository.save.mockResolvedValue(updatedFarm);

            const result = await service.update('uuid', updateFarmDto);

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.save).toHaveBeenCalledWith({
                ...existingFarm,
                ...updateFarmDto,
            });
            expect(result).toEqual(updatedFarm);
        });

        it('should verify new producer when changing producer', async () => {
            const updateFarmDto: UpdateFarmDto = {
                producerId: 'new-producer-uuid',
            };

            const existingFarm = {
                id: 'uuid',
                farmName: 'Fazenda Santa Maria',
                producerId: 'old-producer-uuid',
            };

            const mockNewProducer = { id: 'new-producer-uuid', producerName: 'Maria' };

            jest.spyOn(service, 'findById').mockResolvedValue(existingFarm as any);
            mockProducersService.findById.mockResolvedValue(mockNewProducer);
            mockRepository.save.mockResolvedValue({ ...existingFarm, ...updateFarmDto });

            await service.update('uuid', updateFarmDto);

            expect(mockProducersService.findById).toHaveBeenCalledWith('new-producer-uuid');
        });
    });

    describe('remove', () => {
        it('should remove farm successfully', async () => {
            const existingFarm = {
                id: 'uuid',
                farmName: 'Fazenda Santa Maria',
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingFarm as any);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.remove('uuid');

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.softDelete).toHaveBeenCalledWith('uuid');
        });
    });

    describe('statistics methods', () => {
        it('should return farms count', async () => {
            mockRepository.count.mockResolvedValue(10);

            const result = await service.count();

            expect(mockRepository.count).toHaveBeenCalled();
            expect(result).toBe(10);
        });

        it('should return total hectares', async () => {
            const mockFarms = [{ totalArea: 1000 }, { totalArea: 1500 }, { totalArea: 2000 }];

            mockRepository.find.mockResolvedValue(mockFarms);

            const result = await service.getTotalHectares();

            expect(mockRepository.find).toHaveBeenCalledWith({
                select: ['totalArea'],
            });
            expect(result).toBe(4500);
        });

        it('should return farms by state', async () => {
            const mockFarms = [
                { state: 'MT' },
                { state: 'MT' },
                { state: 'SP' },
                { state: 'RS' },
                { state: 'MT' },
            ];

            mockRepository.find.mockResolvedValue(mockFarms);

            const result = await service.getFarmsByState();

            expect(result).toEqual([
                { state: 'MT', count: 3 },
                { state: 'SP', count: 1 },
                { state: 'RS', count: 1 },
            ]);
        });

        it('should return land use statistics', async () => {
            const mockFarms = [
                { agriculturableArea: 800, vegetationArea: 200 },
                { agriculturableArea: 1200, vegetationArea: 300 },
            ];

            mockRepository.find.mockResolvedValue(mockFarms);

            const result = await service.getLandUseStats();

            expect(result).toEqual([
                { type: 'Agriculturable', area: 2000 },
                { type: 'Vegetation', area: 500 },
            ]);
        });
    });
});
