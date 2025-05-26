import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, Validate } from 'class-validator';
import { FarmAreaValidation } from '../../../common/validators/farm-area.validator';

export class CreateFarmDto {
    @ApiProperty({
        description: 'Nome da fazenda',
        example: 'Fazenda Santa Maria',
    })
    @IsNotEmpty({ message: 'Nome da fazenda é obrigatório' })
    @IsString()
    farmName: string;

    @ApiProperty({
        description: 'Cidade onde a fazenda está localizada',
        example: 'Sorriso',
    })
    @IsNotEmpty({ message: 'Cidade é obrigatória' })
    @IsString()
    city: string;

    @ApiProperty({
        description: 'Estado onde a fazenda está localizada',
        example: 'MT',
    })
    @IsNotEmpty({ message: 'Estado é obrigatório' })
    @IsString()
    state: string;

    @ApiProperty({
        description: 'Área total da fazenda em hectares',
        example: 1000.5,
    })
    @IsNotEmpty({ message: 'Área total é obrigatória' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Área total deve ser um número' })
    @Min(0.01, { message: 'Área total deve ser maior que 0' })
    totalArea: number;

    @ApiProperty({
        description: 'Área agricultável em hectares',
        example: 800.0,
    })
    @IsNotEmpty({ message: 'Área agricultável é obrigatória' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Área agricultável deve ser um número' })
    @Min(0.01, { message: 'Área agricultável deve ser maior ou igual a 0' })
    agriculturableArea: number;

    @ApiProperty({
        description: 'Área de vegetação em hectares',
        example: 200.5,
    })
    @IsNotEmpty({ message: 'Área de vegetação é obrigatória' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Área de vegetação deve ser um número' })
    @Min(0.01, { message: 'Área de vegetação deve ser maior ou igual a 0' })
    vegetationArea: number;

    @ApiProperty({
        description: 'ID do produtor que possui esta fazenda',
        example: 'uuid-here',
    })
    @IsNotEmpty({ message: 'ID do produtor é obrigatório' })
    @IsUUID(4, { message: 'ID do produtor deve ser um UUID válido' })
    producerId: string;

    @Validate(FarmAreaValidation)
    _areaValidation?: any;
}
