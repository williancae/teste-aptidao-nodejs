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

import { CreateFarmCropDto } from './dto/create-farm-crop.dto';
import { QueryFarmCropsDto } from './dto/query-farm-crops.dto';
import { UpdateFarmCropDto } from './dto/update-farm-crop.dto';
import { FarmCrop } from './entities/farm-crop.entity';
import { FarmCropsService } from './farm-crops.service';

@ApiTags('farm-crops')
@Controller('farm-crops')
export class FarmCropsController {
    constructor(private readonly farmCropsService: FarmCropsService) {}

    @Post()
    @ApiOperation({ summary: 'Criar e Associar Safra com Fazenda' })
    @ApiBadRequestResponse({
        description: 'Dados de entrada inválidos',
    })
    async create(@Body() createFarmCropDto: CreateFarmCropDto): Promise<FarmCrop> {
        return this.farmCropsService.create(createFarmCropDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar Safras de Fazenda' })
    async findAll(@Query() query: QueryFarmCropsDto): Promise<{ data: FarmCrop[]; count: number }> {
        return this.farmCropsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar Safra de Fazenda por ID' })
    @ApiParam({ name: 'id', description: 'Farm Crop UUID' })
    @ApiNotFoundResponse({ description: 'Safra da Fazenda não encontrada' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<FarmCrop> {
        return this.farmCropsService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar Safra de Fazenda' })
    @ApiParam({ name: 'id', description: 'Farm Crop UUID' })
    @ApiNotFoundResponse({ description: 'Não encontrado' })
    @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateFarmCropDto: UpdateFarmCropDto,
    ): Promise<FarmCrop> {
        return this.farmCropsService.update(id, updateFarmCropDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remover Safra de Fazenda' })
    @ApiParam({ name: 'id', description: 'Farm Crop UUID' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Removido com sucesso',
    })
    @ApiNotFoundResponse({ description: 'Não encontrado' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.farmCropsService.remove(id);
    }
}
