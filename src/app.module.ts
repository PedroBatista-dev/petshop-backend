// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importa todas as entidades
import { Pais } from './pais/entities/pais.entity';
import { Municipio } from './municipio/entities/municipio.entity';
import { Empresas } from './empresas/entities/empresas.entity';
import { Cargo } from './cargo/entities/cargo.entity';
import { Usuario } from './usuario/entities/usuario.entity';
import { Contatos } from './contatos/entities/contatos.entity';
import { Enderecos } from './enderecos/entities/enderecos.entity';

// Importa todos os módulos
import { PaisModule } from './pais/pais.module';
import { MunicipioModule } from './municipio/municipio.module';
import { EmpresasModule } from './empresas/empresas.module';
import { CargoModule } from './cargo/cargo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ContatosModule } from './contatos/contatos.module';
import { EnderecosModule } from './enderecos/enderecos.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { AuditInterceptor } from './common/audit/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pedrobatista',
      password: 'pedro123',
      database: 'petshop_management_db',
      entities: [
        Pais,
        Municipio,
        Empresas,
        Cargo,
        Usuario,
        Contatos,
        Enderecos,
      ],
      synchronize: false,
      logging: true,
    }),
    PaisModule,
    MunicipioModule,
    EmpresasModule,
    CargoModule,
    UsuarioModule,
    ContatosModule,
    EnderecosModule,
    CommonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, // Provedor global para o interceptor
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}