// src/enderecos/enderecos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecosService } from './enderecos.service';
import { EnderecosController } from './enderecos.controller';
import { Enderecos } from './entities/enderecos.entity';
import { PaisModule } from '../pais/pais.module';
import { MunicipioModule } from '../municipio/municipio.module';
import { EmpresasModule } from '../empresas/empresas.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enderecos]),
    PaisModule,
    MunicipioModule,
    EmpresasModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [EnderecosController],
  providers: [EnderecosService],
  exports: [EnderecosService],
})
export class EnderecosModule {}