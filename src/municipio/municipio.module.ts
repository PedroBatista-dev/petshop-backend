// src/municipio/municipio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipioService } from './municipio.service';
import { MunicipioController } from './municipio.controller';
import { Municipio } from './entities/municipio.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Municipio]), AuthModule],
  controllers: [MunicipioController],
  providers: [MunicipioService],
  exports: [MunicipioService],
})
export class MunicipioModule {}