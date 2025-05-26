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

import { CreateHarvestDto } from './dto/create-harvest.dto';
import { QueryHarvestsDto } from './dto/query-harvests.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from './entities/harvest.entity';
import { HarvestsService } from './harvests.service';

@ApiTags('harvests')
@Controller('harvests')
export class HarvestsController {
    constructor(private readonly harvestsService: HarvestsService) {}

    @Post()
    @ApiOperation({ summary: 'Criar colheita' })
    @ApiBadRequestResponse({
        description: 'Dados de entrada inválidos',
    })
    async create(@Body() createHarvestDto: CreateHarvestDto): Promise<Harvest> {
        return this.harvestsService.create(createHarvestDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar colheitas' })
    async findAll(@Query() query: QueryHarvestsDto): Promise<{ data: Harvest[]; count: number }> {
        return this.harvestsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar colheita por ID' })
    @ApiParam({ name: 'id', description: 'Harvest UUID' })
    @ApiNotFoundResponse({ description: 'Não encontrada' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Harvest> {
        return this.harvestsService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar colheita' })
    @ApiParam({ name: 'id', description: 'Harvest UUID' })
    @ApiNotFoundResponse({ description: 'Colheita não encontrada' })
    @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateHarvestDto: UpdateHarvestDto,
    ): Promise<Harvest> {
        return this.harvestsService.update(id, updateHarvestDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remover colheita' })
    @ApiParam({ name: 'id', description: 'Harvest UUID' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Removida com sucesso',
    })
    @ApiNotFoundResponse({ description: 'Não encontrada' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.harvestsService.remove(id);
    }
}
