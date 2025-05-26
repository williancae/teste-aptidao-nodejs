import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min, Validate } from 'class-validator';
import { CropExistsValidation } from '../../../common/validators/crop-exists.validator';
import { FarmExistsValidation } from '../../../common/validators/farm-exists.validator';
import { HarvestExistsValidation } from '../../../common/validators/harvest-exists.validator';
import { UniqueFarmCropValidation } from '../../../common/validators/unique-farm-crop.validator';

export class CreateFarmCropDto {
    @ApiProperty({
        description: 'ID da Fazenda onde a cultura está plantada',
        example: '6f51f9a8-ff2d-4e1f-bb2a-5fba431d1e9a',
    })
    @IsNotEmpty({ message: 'O ID da Fazenda é obrigatório' })
    @IsUUID(4, { message: 'O ID da Fazenda deve ser um UUID válido' })
    @Validate(FarmExistsValidation)
    farmId: string;

    @ApiProperty({
        description: 'ID da Cultura que está plantada',
        example: '6f51f9a8-ff2d-4e1f-bb2a-5fba431d1e9a',
    })
    @IsNotEmpty({ message: 'O ID da Cultura é obrigatório' })
    @IsUUID(4, { message: 'O ID da Cultura deve ser um UUID válido' })
    @Validate(CropExistsValidation)
    cropId: string;

    @ApiProperty({
        description: 'ID da Safra quando a cultura foi plantada',
        example: '6f51f9a8-ff2d-4e1f-bb2a-5fba431d1e9a',
    })
    @IsNotEmpty({ message: 'O ID da Safra é obrigatório' })
    @IsUUID(4, { message: 'O ID da Safra deve ser um UUID válido' })
    @Validate(HarvestExistsValidation)
    harvestId: string;

    @ApiPropertyOptional({
        description: 'Área plantada em hectares',
        example: 150.5,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'A área plantada deve ser um número' })
    @Min(0.01, { message: 'A área plantada deve ser maior ou igual a 0' })
    plantedArea?: number;

    @ApiPropertyOptional({
        description: 'Rendimento esperado em toneladas',
        example: 450.0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'O rendimento esperado deve ser um número' })
    @Min(0.01, { message: 'Rendimento esperado deve ser maior ou igual 0' })
    expectedYield?: number;

    @ApiPropertyOptional({
        description: 'Rendimento real em toneladas',
        example: 420.5,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'O rendimento real deve ser um número' })
    @Min(0.01, { message: 'Rendimento real deve ser maior ou igual a 0' })
    actualYield?: number;

    @Validate(UniqueFarmCropValidation)
    _uniqueValidation?: any;
}
