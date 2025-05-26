import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { CreateFarmDto } from './dto/create-farm.dto';
import { QueryFarmsDto } from './dto/query-farms.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';
import { FarmsService } from './farms.service';

@ApiTags('farms')
@Controller('farms')
export class FarmsController {
    constructor(private readonly farmsService: FarmsService) {}

    @Post()
    @ApiOperation({ summary: 'Criar fazenda' })
    @ApiBadRequestResponse({
        description: 'Dados de entrada inválidos ou fazenda já existe',
    })
    async create(@Body() createFarmDto: CreateFarmDto): Promise<Farm> {
        return this.farmsService.create(createFarmDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar fazendas' })
    async findAll(@Query() query: QueryFarmsDto): Promise<{ data: Farm[]; count: number }> {
        return this.farmsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar fazenda por ID' })
    @ApiParam({ name: 'id', description: 'Farm UUID' })
    @ApiNotFoundResponse({ description: 'Fazenda não encontrada' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Farm> {
        return this.farmsService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar fazenda' })
    @ApiParam({ name: 'id', description: 'Farm UUID' })
    @ApiNotFoundResponse({ description: 'Fazenda não encontrada' })
    @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateFarmDto: UpdateFarmDto,
    ): Promise<Farm> {
        return this.farmsService.update(id, updateFarmDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remover fazenda' })
    @ApiParam({ name: 'id', description: 'Farm UUID' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Fazenda removida com sucesso',
    })
    @ApiNotFoundResponse({ description: 'Fazenda não encontrada' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.farmsService.remove(id);
    }

    @Get('stats/by-state')
    @ApiOperation({ summary: 'Retorna fazendas por estado' })
    async getFarmsByState(): Promise<{ state: string; count: number }[]> {
        return this.farmsService.getFarmsByState();
    }

    @Get('stats/land-use')
    @ApiOperation({ summary: 'Busca estatísticas de uso da terra' })
    async getLandUseStats(): Promise<{ type: string; area: number }[]> {
        return this.farmsService.getLandUseStats();
    }

    @Get('stats/total-hectares')
    @ApiOperation({ summary: 'Total de hectares' })
    async getTotalHectares(): Promise<{ totalHectares: number }> {
        const totalHectares = await this.farmsService.getTotalHectares();
        return { totalHectares };
    }
}
