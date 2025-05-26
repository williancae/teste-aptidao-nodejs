import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CpfCnpjValidation } from '../../common/validators/cpf-cnpj.validator';
import { SharedModule } from '../../shared/shared.module';
import { Producer } from './entities/producer.entity';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producer]),
    SharedModule,
  ],
  controllers: [ProducersController],
  providers: [
    ProducersService,
    CpfCnpjValidation,
  ],
  exports: [ProducersService],
})
export class ProducersModule {}
