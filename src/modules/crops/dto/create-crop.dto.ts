import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCropDto {
    @ApiProperty({
        description: 'Nome do cultivo.',
        example: 'Soja',
    })
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @IsString()
    cropName: string;

    @ApiPropertyOptional({
        description: 'Descrição do que será plantado. Opcional.',
        example: 'Soja plantada na safra de verão',
    })
    @IsOptional()
    @IsString()
    description?: string;
}
