import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { GenericQueryDto } from '../../../shared/dtos/generic-query.dto';

export class QueryProducersDto extends GenericQueryDto {
    @ApiPropertyOptional({ description: 'Filtrar por estado' })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional({ description: 'Filtrar por cidade' })
    @IsOptional()
    @IsString()
    city?: string;
}
