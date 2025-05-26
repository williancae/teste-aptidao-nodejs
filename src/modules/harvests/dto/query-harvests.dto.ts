import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { GenericQueryDto } from '../../../shared/dtos/generic-query.dto';

export class QueryHarvestsDto extends GenericQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by harvest year',
    example: 2024,
    minimum: 2000,
    maximum: 2050
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Harvest year must be an integer' })
  @Min(2000, { message: 'Harvest year must be at least 2000' })
  @Max(2050, { message: 'Harvest year must not exceed 2050' })
  harvestYear?: number;
}
