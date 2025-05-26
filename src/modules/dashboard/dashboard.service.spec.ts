import { Test, TestingModule } from '@nestjs/testing';

import { CacheService } from '../../shared/services/cache.service';
import { CropsService } from '../crops/crops.service';
import { FarmsService } from '../farms/farms.service';
import { ProducersService } from '../producers/producers.service';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
};

const mockFarmsService = {
    count: jest.fn(),
    getTotalHectares: jest.fn(),
    getFarmsByState: jest.fn(),
    getLandUseStats: jest.fn(),
};

const mockProducersService = {
    count: jest.fn(),
};

const mockCropsService = {
    getCropStats: jest.fn(),
};

const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

describe('DashboardService', () => {
    let service: DashboardService;
    let cacheService: CacheService;
    let farmsService: FarmsService;
    let producersService: ProducersService;
    let cropsService: CropsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DashboardService,
                {
                    provide: CacheService,
                    useValue: mockCacheService,
                },
                {
                    provide: FarmsService,
                    useValue: mockFarmsService,
                },
                {
                    provide: ProducersService,
                    useValue: mockProducersService,
                },
                {
                    provide: CropsService,
                    useValue: mockCropsService,
                },
            ],
        }).compile();

        service = module.get<DashboardService>(DashboardService);
        cacheService = module.get<CacheService>(CacheService);
        farmsService = module.get<FarmsService>(FarmsService);
        producersService = module.get<ProducersService>(ProducersService);
        cropsService = module.get<CropsService>(CropsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDashboardStats', () => {
        const mockDashboardData: DashboardResponseDto = {
            totalFarms: 100,
            totalProducers: 80,
            totalHectares: 50000.5,
            farmsByState: [
                { state: 'MT', count: 40 },
                { state: 'SP', count: 35 },
                { state: 'RS', count: 25 },
            ],
            cropStats: [
                { cropName: 'Soja', count: 60, totalArea: 25000 },
                { cropName: 'Milho', count: 45, totalArea: 18000 },
            ],
            landUse: [
                { type: 'Agriculturable', area: 40000 },
                { type: 'Vegetation', area: 10500.5 },
            ],
        };

        it('should return cached dashboard stats when available', async () => {
            mockCacheService.get.mockResolvedValue(mockDashboardData);

            const result = await service.getDashboardStats();

            expect(mockCacheService.get).toHaveBeenCalledWith(
                expect.stringContaining('dashboard:getDashboardStats'),
            );
            expect(result).toEqual(mockDashboardData);
            expect(mockFarmsService.count).not.toHaveBeenCalled();
        });

        it('should generate fresh stats when cache is empty', async () => {
            mockCacheService.get.mockResolvedValue(undefined);

            mockFarmsService.count.mockResolvedValue(100);
            mockProducersService.count.mockResolvedValue(80);
            mockFarmsService.getTotalHectares.mockResolvedValue(50000.5);
            mockFarmsService.getFarmsByState.mockResolvedValue([
                { state: 'MT', count: 40 },
                { state: 'SP', count: 35 },
                { state: 'RS', count: 25 },
            ]);
            mockCropsService.getCropStats.mockResolvedValue([
                { cropName: 'Soja', count: 60, totalArea: 25000 },
                { cropName: 'Milho', count: 45, totalArea: 18000 },
            ]);
            mockFarmsService.getLandUseStats.mockResolvedValue([
                { type: 'Agriculturable', area: 40000 },
                { type: 'Vegetation', area: 10500.5 },
            ]);

            const result = await service.getDashboardStats();

            expect(mockCacheService.get).toHaveBeenCalled();
            expect(mockFarmsService.count).toHaveBeenCalled();
            expect(mockProducersService.count).toHaveBeenCalled();
            expect(mockFarmsService.getTotalHectares).toHaveBeenCalled();
            expect(mockFarmsService.getFarmsByState).toHaveBeenCalled();
            expect(mockCropsService.getCropStats).toHaveBeenCalled();
            expect(mockFarmsService.getLandUseStats).toHaveBeenCalled();
            expect(mockCacheService.set).toHaveBeenCalled();
            expect(result).toEqual(mockDashboardData);
        });

        it('should handle empty data gracefully', async () => {
            mockCacheService.get.mockResolvedValue(undefined);

            mockFarmsService.count.mockResolvedValue(0);
            mockProducersService.count.mockResolvedValue(0);
            mockFarmsService.getTotalHectares.mockResolvedValue(0);
            mockFarmsService.getFarmsByState.mockResolvedValue([]);
            mockCropsService.getCropStats.mockResolvedValue([]);
            mockFarmsService.getLandUseStats.mockResolvedValue([]);

            const result = await service.getDashboardStats();

            expect(result).toEqual({
                totalFarms: 0,
                totalProducers: 0,
                totalHectares: 0,
                farmsByState: [],
                cropStats: [],
                landUse: [],
            });
        });
    });

    describe('private cache methods', () => {
        it('should use cache for individual statistics', async () => {
            mockCacheService.get.mockResolvedValueOnce(undefined);
            mockCacheService.get.mockResolvedValueOnce(100);

            mockProducersService.count.mockResolvedValue(80);
            mockFarmsService.getTotalHectares.mockResolvedValue(50000);
            mockFarmsService.getFarmsByState.mockResolvedValue([]);
            mockCropsService.getCropStats.mockResolvedValue([]);
            mockFarmsService.getLandUseStats.mockResolvedValue([]);

            await service.getDashboardStats();

            expect(mockFarmsService.count).not.toHaveBeenCalled();
            expect(mockProducersService.count).toHaveBeenCalled();
        });
    });
});
