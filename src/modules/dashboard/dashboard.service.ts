import { Injectable } from '@nestjs/common';

import { CacheService } from '../../shared/services/cache.service';
import { CACHE_KEYS, createCacheKey } from '../../shared/utils/cache-keys';
import { CropsService } from '../crops/crops.service';
import { FarmsService } from '../farms/farms.service';
import { ProducersService } from '../producers/producers.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
    constructor(
        private readonly farmsService: FarmsService,
        private readonly producersService: ProducersService,
        private readonly cropsService: CropsService,
        private readonly cacheService: CacheService,
    ) {}

    async getDashboardStats(): Promise<DashboardResponseDto> {
        const cacheKey = createCacheKey(CACHE_KEYS.dashboard, 600, 'getDashboardStats');

        const cachedStats = await this.cacheService.get<DashboardResponseDto>(cacheKey.id);
        if (cachedStats) {
            return cachedStats;
        }

        const [totalFarms, totalProducers, totalHectares, farmsByState, cropStats, landUse] =
            await Promise.all([
                this.getTotalFarmsWithCache(),
                this.getTotalProducersWithCache(),
                this.getTotalHectaresWithCache(),
                this.getFarmsByStateWithCache(),
                this.getCropStatsWithCache(),
                this.getLandUseStatsWithCache(),
            ]);

        const dashboardData: DashboardResponseDto = {
            totalFarms,
            totalProducers,
            totalHectares,
            farmsByState,
            cropStats,
            landUse,
        };

        await this.cacheService.set({
            id: cacheKey.id,
            milliseconds: cacheKey.milliseconds,
            value: dashboardData,
        });

        return dashboardData;
    }

    private async getTotalFarmsWithCache(): Promise<number> {
        const cacheKey = createCacheKey(CACHE_KEYS.farms, 300, 'count');

        const cached = await this.cacheService.get<number>(cacheKey.id);
        if (cached !== undefined) return cached;

        const result = await this.farmsService.count();
        await this.cacheService.set({
            id: cacheKey.id,
            milliseconds: cacheKey.milliseconds,
            value: result,
        });

        return result;
    }

    private async getTotalProducersWithCache(): Promise<number> {
        const cacheKey = createCacheKey(CACHE_KEYS.producers, 300, 'count');

        const cached = await this.cacheService.get<number>(cacheKey.id);
        if (cached !== undefined) return cached;

        const result = await this.producersService.count();
        await this.cacheService.set({
            id: cacheKey.id,
            milliseconds: cacheKey.milliseconds,
            value: result,
        });

        return result;
    }

    private async getTotalHectaresWithCache(): Promise<number> {
        const cacheKey = createCacheKey(CACHE_KEYS.farms, 300, 'getTotalHectares');

        const cached = await this.cacheService.get<number>(cacheKey.id);
        if (cached !== undefined) return cached;

        const result = await this.farmsService.getTotalHectares();
        await this.cacheService.set({
            id: cacheKey.id,
            milliseconds: cacheKey.milliseconds,
            value: result,
        });

        return result;
    }

    private async getFarmsByStateWithCache(): Promise<Array<{ state: string; count: number }>> {
        const cacheKey = createCacheKey(CACHE_KEYS.farms, 300, 'getFarmsByState');

        const cached = await this.cacheService.get<Array<{ state: string; count: number }>>(
            cacheKey.id,
        );
        if (cached !== undefined) return cached;

        const result = await this.farmsService.getFarmsByState();
        await this.cacheService.set({
            id: cacheKey.id,
            milliseconds: cacheKey.milliseconds,
            value: result,
        });

        return result;
    }

    private async getCropStatsWithCache(): Promise<
        Array<{ cropName: string; count: number; totalArea: number }>
    > {
        const cacheKey = createCacheKey(CACHE_KEYS.crops, 300, 'getCropStats');

        const cached = await this.cacheService.get<
            Array<{ cropName: string; count: number; totalArea: number }>
        >(cacheKey.id);
        if (cached !== undefined) return cached;

        const result = await this.cropsService.getCropStats();
        await this.cacheService.set({
            id: cacheKey.id,
            milliseconds: cacheKey.milliseconds,
            value: result,
        });

        return result;
    }

    private async getLandUseStatsWithCache(): Promise<Array<{ type: string; area: number }>> {
        const cacheKey = createCacheKey(CACHE_KEYS.farms, 300, 'getLandUseStats');

        const cached = await this.cacheService.get<Array<{ type: string; area: number }>>(
            cacheKey.id,
        );
        if (cached !== undefined) return cached;

        const result = await this.farmsService.getLandUseStats();
        await this.cacheService.set({
            id: cacheKey.id,
            milliseconds: cacheKey.milliseconds,
            value: result,
        });

        return result;
    }
}
