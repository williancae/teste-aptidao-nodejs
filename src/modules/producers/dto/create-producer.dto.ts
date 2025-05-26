import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { CpfCnpjValidation } from '../../../common/validators/cpf-cnpj.validator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'Producer CPF or CNPJ',
    example: '12345678901',
  })
  @IsNotEmpty({ message: 'CPF/CNPJ is required' })
  @IsString()
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  @Validate(CpfCnpjValidation)
  cpfCnpj: string;

  @ApiProperty({
    description: 'Producer name',
    example: 'João Silva',
  })
  @IsNotEmpty({ message: 'Producer name is required' })
  @IsString()
  producerName: string;
}
