export const CACHE_KEYS = {
    producers: 'producers',
    farms: 'farms',
    crops: 'crops',
    harvests: 'harvests',
    farmCrops: 'farm-crops',
    dashboard: 'dashboard',
};

export function createCacheKey(
    module: string,
    ttl: number,
    method: string,
    ...params: any[]
): { id: string; milliseconds: number } {
    const key = `${module}:${method}:${JSON.stringify(params)}`;
    return {
        id: key,
        milliseconds: (ttl || 5) * 1000,
    };
}
