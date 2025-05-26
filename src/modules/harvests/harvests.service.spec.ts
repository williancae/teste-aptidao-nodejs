import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { QueryHarvestsDto } from './dto/query-harvests.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from './entities/harvest.entity';
import { HarvestsService } from './harvests.service';

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

describe('HarvestsService', () => {
    let service: HarvestsService;
    let repository: Repository<Harvest>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HarvestsService,
                {
                    provide: getRepositoryToken(Harvest),
                    useValue: mockRepository,
                },
                {
                    provide: SharedService,
                    useValue: mockSharedService,
                },
            ],
        }).compile();

        service = module.get<HarvestsService>(HarvestsService);
        repository = module.get<Repository<Harvest>>(getRepositoryToken(Harvest));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        const createHarvestDto: CreateHarvestDto = {
            harvestName: 'Safra 2024/2025',
            harvestYear: 2024,
            startDate: '2024-03-01',
            endDate: '2024-09-30',
        };

        it('should create a harvest successfully', async () => {
            const expectedHarvest = {
                id: 'uuid',
                harvestName: 'Safra 2024/2025',
                harvestYear: 2024,
                startDate: new Date('2024-03-01'),
                endDate: new Date('2024-09-30'),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(expectedHarvest);
            mockRepository.save.mockResolvedValue(expectedHarvest);

            const result = await service.create(createHarvestDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { harvestName: 'Safra 2024/2025' },
            });
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createHarvestDto,
                startDate: new Date('2024-03-01'),
                endDate: new Date('2024-09-30'),
            });
            expect(result).toEqual(expectedHarvest);
        });

        it('should create harvest without dates', async () => {
            const dtoWithoutDates = {
                harvestName: 'Safra 2024/2025',
                harvestYear: 2024,
            };

            const expectedHarvest = {
                id: 'uuid',
                ...dtoWithoutDates,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(expectedHarvest);
            mockRepository.save.mockResolvedValue(expectedHarvest);

            const result = await service.create(dtoWithoutDates);

            expect(mockRepository.create).toHaveBeenCalledWith({
                ...dtoWithoutDates,
                startDate: undefined,
                endDate: undefined,
            });
            expect(result).toEqual(expectedHarvest);
        });

        it('should throw BadRequestException when harvest already exists', async () => {
            const existingHarvest = { id: 'existing-uuid', harvestName: 'Safra 2024/2025' };
            mockRepository.findOne.mockResolvedValue(existingHarvest);

            await expect(service.create(createHarvestDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return paginated harvests', async () => {
            const queryDto: QueryHarvestsDto = { skip: 0, take: 10, harvestYear: 2024 };
            const expectedResult = {
                data: [{ id: 'uuid', harvestName: 'Safra 2024/2025' }],
                count: 1,
            };

            mockSharedService.paginate.mockResolvedValue(expectedResult);

            const result = await service.findAll(queryDto);

            expect(mockSharedService.paginate).toHaveBeenCalledWith({
                repository: mockRepository,
                searchFields: ['harvestName'],
                dto: { skip: 0, take: 10 },
                andWhere: { harvestYear: 2024 },
                queryOptions: {
                    relations: ['farmCrops'],
                },
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findById', () => {
        it('should return a harvest when found', async () => {
            const expectedHarvest = {
                id: 'uuid',
                harvestName: 'Safra 2024/2025',
                harvestYear: 2024,
            };

            mockRepository.findOne.mockResolvedValue(expectedHarvest);

            const result = await service.findById('uuid');

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'uuid' },
                relations: ['farmCrops', 'farmCrops.farm', 'farmCrops.crop'],
                cache: expect.any(Object),
            });
            expect(result).toEqual(expectedHarvest);
        });

        it('should throw NotFoundException when harvest not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findById('non-existing-uuid')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update harvest successfully', async () => {
            const updateHarvestDto: UpdateHarvestDto = {
                harvestName: 'Safra 2024/2025 Atualizada',
                startDate: '2024-04-01',
            };

            const existingHarvest = {
                id: 'uuid',
                harvestName: 'Safra 2024/2025',
                harvestYear: 2024,
            };

            const updatedHarvest = {
                ...existingHarvest,
                harvestName: 'Safra 2024/2025 Atualizada',
                startDate: new Date('2024-04-01'),
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingHarvest as any);
            mockRepository.save.mockResolvedValue(updatedHarvest);

            const result = await service.update('uuid', updateHarvestDto);

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.save).toHaveBeenCalledWith({
                ...existingHarvest,
                ...updateHarvestDto,
                startDate: new Date('2024-04-01'),
            });
            expect(result).toEqual(updatedHarvest);
        });

        it('should throw BadRequestException when updating to existing harvest name', async () => {
            const updateHarvestDto: UpdateHarvestDto = {
                harvestName: 'Safra 2023/2024',
            };

            const existingHarvest = {
                id: 'uuid',
                harvestName: 'Safra 2024/2025',
            };

            const conflictingHarvest = {
                id: 'other-uuid',
                harvestName: 'Safra 2023/2024',
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingHarvest as any);
            mockRepository.findOne.mockResolvedValue(conflictingHarvest);

            await expect(service.update('uuid', updateHarvestDto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('remove', () => {
        it('should remove harvest successfully', async () => {
            const existingHarvest = {
                id: 'uuid',
                harvestName: 'Safra 2024/2025',
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingHarvest as any);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.remove('uuid');

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.softDelete).toHaveBeenCalledWith('uuid');
        });
    });
});
