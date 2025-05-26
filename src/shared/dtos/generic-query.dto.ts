import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GenericQueryDto {
    constructor(partial: Partial<GenericQueryDto>) {
        Object.assign(this, partial);
    }

    @ApiPropertyOptional({
        description: 'Termo de busca para filtrar resultados',
        example: 'João Silva',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Data inicial para filtro de intervalo de datas. Exemplo: 2024-01-01',
    })
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : null))
    @IsOptional()
    from?: Date;

    @ApiPropertyOptional({
        description: 'Data final para filtro de intervalo de datas. Exemplo: 2024-12-31',
    })
    @IsDate()
    @Transform(({ value }) => (value ? new Date(value) : null))
    @IsOptional()
    to?: Date;

    @ApiPropertyOptional({
        description: 'Nome do campo para filtro de intervalo de datas',
        example: 'createdAt',
    })
    @IsOptional()
    @IsString()
    intervalName?: string;

    @ApiPropertyOptional({
        description: 'Campo de ordenação e direção. Formato: campo:direção',
        example: 'createdAt:DESC',
    })
    @IsOptional()
    @IsString()
    sort?: string;

    @ApiPropertyOptional({
        description: 'Número de itens para pular',
        default: 0,
        minimum: 0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    skip?: number = 0;

    @ApiPropertyOptional({
        description: 'Número de itens a retornar por página',
        default: 10,
        minimum: 1,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    take?: number = 10;
}
