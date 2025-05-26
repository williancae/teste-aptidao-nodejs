import { Injectable } from '@nestjs/common';
import {
    Between,
    FindManyOptions,
    FindOperator,
    FindOptionsWhere,
    ILike,
    ObjectLiteral,
    Repository,
} from 'typeorm';

import { GenericQueryDto } from '../dtos/generic-query.dto';

interface GetPaginateParamsOptions<TEntity> {
    searchFields?: Array<keyof TEntity>;
    dto: GenericQueryDto;
    orWhere?: FindOptionsWhere<TEntity>[];
    andWhere?: FindOptionsWhere<TEntity>;
}

interface PaginateOptions<TEntity extends ObjectLiteral> extends GetPaginateParamsOptions<TEntity> {
    repository: Repository<TEntity>;
    queryOptions?: FindManyOptions<TEntity>;
}

@Injectable()
export class SharedService {
    async paginate<TEntity extends ObjectLiteral>({
        repository,
        ...options
    }: PaginateOptions<TEntity>) {
        const queryParams = this.getPaginateParams<TEntity>(options);

        const [data, count] = await repository.findAndCount({
            ...queryParams,
            ...options.queryOptions,

            where: options.queryOptions?.where
                ? Array.isArray(queryParams.where)
                    ? queryParams.where.map(w => ({ ...w, ...options?.queryOptions?.where }))
                    : { ...queryParams.where, ...options.queryOptions.where }
                : queryParams.where,
        });

        return { data, count };
    }

    getPaginateParams<TEntity>({
        dto,
        searchFields = [],
        orWhere: initialOrWhere = [],
        andWhere: initialAndWhere,
    }: GetPaginateParamsOptions<TEntity>) {
        const { search, from, to, intervalName, sort, take, skip } = dto;

        let orWhere: FindOptionsWhere<TEntity>[] = [...initialOrWhere];

        if (search && searchFields.length > 0) {
            const searchWhere = searchFields.map(field => ({
                [field]: ILike(`%${search}%`),
            })) as FindOptionsWhere<TEntity>[];

            orWhere = [...orWhere, ...searchWhere];
        }

        const whereInterval: Record<string, FindOperator<unknown>> = {};
        if (intervalName && from && to) {
            whereInterval[intervalName] = Between(from, to);
        }

        const andWhere: Record<string, FindOperator<unknown>> = {
            ...initialAndWhere,
            ...whereInterval,
        };

        const where =
            orWhere.length > 0 ? orWhere.map(item => ({ ...item, ...andWhere })) : andWhere;

        const [sortField, sortDirection] = sort?.split(':') || ['createdAt', 'DESC'];

        return {
            where,
            take: take || 10,
            skip: skip || 0,
            order: {
                [sortField]: sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
            },
        } as FindManyOptions<TEntity>;
    }

    /**
     * Helper method to validate pagination parameters
     */
    validatePaginationParams(take?: number, skip?: number): { take: number; skip: number } {
        const validatedTake = Math.min(Math.max(take || 10, 1), 100);
        const validatedSkip = Math.max(skip || 0, 0);

        return { take: validatedTake, skip: validatedSkip };
    }

    /**
     * Helper method to build simple where conditions
     */
    buildSimpleWhere<TEntity>(filters: Record<string, any>): FindOptionsWhere<TEntity> {
        const where: Record<string, any> = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                where[key] = value;
            }
        });

        return where as FindOptionsWhere<TEntity>;
    }
}
