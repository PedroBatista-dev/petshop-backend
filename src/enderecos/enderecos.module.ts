// src/enderecos/enderecos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecosService } from './enderecos.service';
import { EnderecosController } from './enderecos.controller';
import { Endereco } from './entities/endereco.entity';
import { PaisesModule } from '../pais/paises.module';
import { MunicipiosModule } from '../municipios/municipios.module';
import { EmpresasModule } from '../empresas/empresas.module';
import { UsuariosModule } from '../usuario/usuarios.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Endereco]),
    PaisesModule,
    MunicipiosModule,
    EmpresasModule,
    UsuariosModule,
    AuthModule,
  ],
  controllers: [EnderecosController],
  providers: [EnderecosService],
  exports: [EnderecosService],
})
export class EnderecosModule {}
