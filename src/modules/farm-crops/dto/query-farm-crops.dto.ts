import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { GenericQueryDto } from '../../../shared/dtos/generic-query.dto';

export class QueryFarmCropsDto extends GenericQueryDto {
    @ApiPropertyOptional({
        description: 'Filtrar por ID da fazenda',
        example: '6f51f9a8-ff2d-4e1f-bb2a-5fba431d1e9a',
    })
    @IsOptional()
    @IsUUID(4, { message: 'ID da fazenda deve ser um UUID válido' })
    farmId?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por ID da cultura',
        example: '6f51f9a8-ff2d-4e1f-bb2a-5fba431d1e9a',
    })
    @IsOptional()
    @IsUUID(4, { message: 'ID da cultura deve ser um UUID válido' })
    cropId?: string;

    @ApiPropertyOptional({
        description: 'Filtrar por ID da colheita',
        example: '6f51f9a8-ff2d-4e1f-bb2a-5fba431d1e9a',
    })
    @IsOptional()
    @IsUUID(4, { message: 'ID da colheita deve ser um UUID válido' })
    harvestId?: string;
}
