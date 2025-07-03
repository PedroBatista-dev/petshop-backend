// src/pais/pais.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';
import { Pais } from './entities/pais.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pais]), AuthModule],
  controllers: [PaisController],
  providers: [PaisService],
  exports: [PaisService],
})
export class PaisModule {}