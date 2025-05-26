import { ApiProperty } from '@nestjs/swagger';

export class FarmsByStateDto {
    @ApiProperty({
        description: 'Sigla do estado',
        example: 'SP',
    })
    state: string;

    @ApiProperty({
        description: 'Numero de fazendas registradas neste estado',
        example: 15,
    })
    count: number;
}

export class CropStatsDto {
    @ApiProperty({ description: 'Nome da cultura(o que é plantado)', example: 'Soja' })
    cropName: string;

    @ApiProperty({ description: 'Número de vezes que esta cultura é plantada', example: 25 })
    count: number;

    @ApiProperty({
        description: 'Área total plantada com esta cultura em hectares',
        example: 1250.5,
    })
    totalArea: number;
}

export class LandUseDto {
    @ApiProperty({ description: 'Tipo de uso da terra', example: 'Agriculturable' })
    type: string;

    @ApiProperty({ description: 'Área total em hectares', example: 5000.0 })
    area: number;
}

export class DashboardResponseDto {
    @ApiProperty({
        description: 'Número total de fazendas registradas',
        example: 150,
    })
    totalFarms: number;

    @ApiProperty({
        description: 'Número total de produtores registrados',
        example: 120,
    })
    totalProducers: number;

    @ApiProperty({
        description: 'Total de hectares registrados em todas as fazendas',
        example: 25000.5,
    })
    totalHectares: number;

    @ApiProperty({
        description: 'Número de fazendas agrupadas por estado',
        type: [FarmsByStateDto],
    })
    farmsByState: FarmsByStateDto[];

    @ApiProperty({
        description: 'Estatísticas sobre culturas plantadas',
        type: [CropStatsDto],
    })
    cropStats: CropStatsDto[];

    @ApiProperty({
        description: 'Distribuição do uso da terra (agricultável vs vegetação)',
        type: [LandUseDto],
    })
    landUse: LandUseDto[];
}
