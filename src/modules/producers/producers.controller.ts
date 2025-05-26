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

import { CreateProducerDto } from './dto/create-producer.dto';
import { QueryProducersDto } from './dto/query-producers.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';
import { ProducersService } from './producers.service';

@ApiTags('producers')
@Controller('producers')
export class ProducersController {
    constructor(private readonly producersService: ProducersService) {}

    @Post()
    @ApiOperation({ summary: 'Criar produtor' })
    @ApiBadRequestResponse({
        description: 'Dados de entrada inválidos',
    })
    async create(@Body() createProducerDto: CreateProducerDto): Promise<Producer> {
        return this.producersService.create(createProducerDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar produtores' })
    async findAll(@Query() query: QueryProducersDto): Promise<{ data: Producer[]; count: number }> {
        return this.producersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar produtor por ID' })
    @ApiParam({ name: 'id', description: 'Producer UUID' })
    @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Producer> {
        return this.producersService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar produtor' })
    @ApiParam({ name: 'id', description: 'Producer UUID' })
    @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
    @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProducerDto: UpdateProducerDto,
    ): Promise<Producer> {
        return this.producersService.update(id, updateProducerDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remover produtor' })
    @ApiParam({ name: 'id', description: 'Producer UUID' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Removido com sucesso',
    })
    @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.producersService.remove(id);
    }
}
