import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
    Validate,
} from 'class-validator';
import { HarvestDateValidation } from '../../../common/validators/harvest-date.validator';

export class CreateHarvestDto {
    @ApiProperty({
        description: 'Nome da safra',
        example: 'Safra 2024/2025',
    })
    @IsNotEmpty({ message: 'O nome da safra é obrigatório' })
    @IsString()
    harvestName: string;

    @ApiProperty({
        description: 'Ano da safra',
        example: 2024,
    })
    @IsNotEmpty({ message: 'O ano da safra é obrigatório' })
    @Type(() => Number)
    @IsInt({ message: 'O ano da safra deve ser um número inteiro' })
    @Min(2000, { message: 'O ano da safra deve ser pelo menos 2000' })
    @Max(2050, { message: 'O ano da safra não deve exceder 2050' })
    harvestYear: number;

    @ApiPropertyOptional({
        description: 'Data de início da safra',
        example: '2024-03-01',
    })
    @IsOptional()
    @IsDateString({}, { message: 'A data de início deve ser uma data válida' })
    startDate?: string;

    @ApiPropertyOptional({
        description: 'Data de término da safra',
        example: '2024-09-30',
    })
    @IsOptional()
    @IsDateString({}, { message: 'A data de término deve ser uma data válida' })
    endDate?: string;

    @Validate(HarvestDateValidation)
    _dateValidation?: any;
}
