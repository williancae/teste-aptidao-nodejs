import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    @ApiOperation({
        summary: 'Busca estatísticas do dashboard',
        description:
            'Retorna as estatísticas do dashboard, incluindo informações sobre usuários, safras, colheitas e mais.',
    })
    async getDashboardStats(): Promise<DashboardResponseDto> {
        return this.dashboardService.getDashboardStats();
    }
}
