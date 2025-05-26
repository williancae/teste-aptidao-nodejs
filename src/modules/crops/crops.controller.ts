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

import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { QueryCropsDto } from './dto/query-crops.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

@ApiTags('crops')
@Controller('crops')
export class CropsController {
    constructor(private readonly cropsService: CropsService) {}

    @Post()
    @ApiOperation({ summary: 'Criar Safra' })
    @ApiBadRequestResponse({
        description: 'Dados de entrada inválidos ou safra já existe',
    })
    async create(@Body() createCropDto: CreateCropDto): Promise<Crop> {
        return this.cropsService.create(createCropDto);
    }

    @Get()
    @ApiOperation({ summary: 'Retornar lista de safras' })
    async findAll(@Query() query: QueryCropsDto): Promise<{ data: Crop[]; count: number }> {
        return this.cropsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar safra por ID' })
    @ApiParam({ name: 'id', description: 'Crop UUID' })
    @ApiNotFoundResponse({ description: 'Safra não encontrada' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Crop> {
        return this.cropsService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar safra' })
    @ApiParam({ name: 'id', description: 'Crop UUID' })
    @ApiNotFoundResponse({ description: 'Safra não encontrada' })
    @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCropDto: UpdateCropDto,
    ): Promise<Crop> {
        return this.cropsService.update(id, updateCropDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletar safra' })
    @ApiParam({ name: 'id', description: 'Crop UUID' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Safra deletada com sucesso',
    })
    @ApiNotFoundResponse({ description: 'Safra não encontrada' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.cropsService.remove(id);
    }

    @Get('stats/crop-statistics')
    @ApiOperation({ summary: 'Obter estatísticas de safras' })
    async getCropStats(): Promise<Array<{ cropName: string; count: number; totalArea: number }>> {
        return this.cropsService.getCropStats();
    }
}
