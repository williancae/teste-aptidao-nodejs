import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SharedService } from '../../shared/services/shared.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';
import { ProducersService } from './producers.service';

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

const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

describe('ProducersService', () => {
    let service: ProducersService;
    let repository: Repository<Producer>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProducersService,
                {
                    provide: getRepositoryToken(Producer),
                    useValue: mockRepository,
                },
                {
                    provide: SharedService,
                    useValue: mockSharedService,
                },
            ],
        }).compile();

        service = module.get<ProducersService>(ProducersService);
        repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        const createProducerDto: CreateProducerDto = {
            cpfCnpj: '12345678901',
            producerName: 'João Silva',
        };

        it('should create a producer successfully', async () => {
            const expectedProducer = {
                id: 'uuid',
                cpfCnpj: '12345678901',
                producerName: 'João Silva',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(expectedProducer);
            mockRepository.save.mockResolvedValue(expectedProducer);

            const result = await service.create(createProducerDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { cpfCnpj: '12345678901' },
            });
            expect(mockRepository.create).toHaveBeenCalledWith({
                cpfCnpj: '12345678901',
                producerName: 'João Silva',
            });
            expect(result).toEqual(expectedProducer);
        });

        it('should throw BadRequestException when producer already exists', async () => {
            const existingProducer = { id: 'existing-uuid', cpfCnpj: '12345678901' };
            mockRepository.findOne.mockResolvedValue(existingProducer);

            await expect(service.create(createProducerDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findById', () => {
        it('should return a producer when found', async () => {
            const expectedProducer = {
                id: 'uuid',
                cpfCnpj: '12345678901',
                producerName: 'João Silva',
            };

            mockRepository.findOne.mockResolvedValue(expectedProducer);

            const result = await service.findById('uuid');

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'uuid' },
                relations: [
                    'farms',
                    'farms.farmCrops',
                    'farms.farmCrops.crop',
                    'farms.farmCrops.harvest',
                ],
                cache: expect.any(Object),
            });
            expect(result.cpfCnpj).toBeDefined();
        });

        it('should throw NotFoundException when producer not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findById('non-existing-uuid')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update producer successfully', async () => {
            const updateProducerDto: UpdateProducerDto = {
                producerName: 'João Silva Updated',
            };

            const existingProducer = {
                id: 'uuid',
                cpfCnpj: '12345678901',
                producerName: 'João Silva',
            };

            const updatedProducer = {
                ...existingProducer,
                ...updateProducerDto,
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingProducer as any);
            mockRepository.save.mockResolvedValue(updatedProducer);

            const result = await service.update('uuid', updateProducerDto);

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.save).toHaveBeenCalledWith({
                ...existingProducer,
                ...updateProducerDto,
            });
            expect(result).toEqual(updatedProducer);
        });
    });

    describe('remove', () => {
        it('should remove producer successfully', async () => {
            const existingProducer = {
                id: 'uuid',
                cpfCnpj: '12345678901',
                producerName: 'João Silva',
            };

            jest.spyOn(service, 'findById').mockResolvedValue(existingProducer as any);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.remove('uuid');

            expect(service.findById).toHaveBeenCalledWith('uuid');
            expect(mockRepository.softDelete).toHaveBeenCalledWith('uuid');
        });
    });

    describe('count', () => {
        it('should return producers count', async () => {
            mockRepository.count.mockResolvedValue(5);

            const result = await service.count();

            expect(mockRepository.count).toHaveBeenCalled();
            expect(result).toBe(5);
        });
    });
});
