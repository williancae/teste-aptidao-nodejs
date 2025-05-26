import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { GenericQueryDto } from '../../../shared/dtos/generic-query.dto';

export class QueryFarmsDto extends GenericQueryDto {
    @ApiPropertyOptional({ description: 'Filtrar por ID do produtor' })
    @IsOptional()
    @IsUUID(4, { message: 'O ID do produtor deve ser um UUID válido' })
    producerId?: string;

    @ApiPropertyOptional({ description: 'Filtrar por estado' })
    @IsOptional()
    @IsString({ message: 'O estado deve ser uma string válida' })
    state?: string;

    @ApiPropertyOptional({ description: 'Filtrar por cidade' })
    @IsOptional()
    @IsString({ message: 'A cidade deve ser uma string válida' })
    city?: string;
}
