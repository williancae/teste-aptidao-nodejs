import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_KEYS } from '../utils/cache-keys';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>({
    id,
    milliseconds,
    value,
  }: {
    id: string;
    milliseconds: number;
    value: T;
  }) {
    return this.cacheManager.set(id, value, milliseconds);
  }

  async deleteByPrefix(prefix: string) {
    await this.deleteByPrefixWithoutRelatedKeys(prefix);

    const relatedKeys = this.getRelatedKeys(prefix);

    if (relatedKeys.length > 0) {
      await Promise.all(
        relatedKeys.map((key) =>
          this.deleteByPrefixWithoutRelatedKeys(key),
        ),
      );
    }
  }

  private async deleteByPrefixWithoutRelatedKeys(prefix: string) {
    const client = this.cacheManager.store;
    const keys = await client.keys(`${prefix}*`);

    for (const key of keys) {
      await client.del(key);
    }
  }

  private getRelatedKeys(key: string) {
    const keys: Record<string, string[]> = {
      [CACHE_KEYS.producers]: [CACHE_KEYS.dashboard],
      [CACHE_KEYS.farms]: [CACHE_KEYS.dashboard],
      [CACHE_KEYS.crops]: [CACHE_KEYS.dashboard],
      [CACHE_KEYS.harvests]: [CACHE_KEYS.dashboard],
      [CACHE_KEYS.farmCrops]: [CACHE_KEYS.dashboard],
    };

    return keys[key] || [];
  }
}
