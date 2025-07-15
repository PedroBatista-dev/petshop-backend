// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importa todas as entidades
import { Pais } from './pais/entities/pais.entity';
import { Municipio } from './municipios/entities/municipio.entity';
import { Empresa } from './empresas/entities/empresa.entity';
import { Cargo } from './cargos/entities/cargo.entity';
import { Usuario } from './usuario/entities/usuario.entity';
import { Contato } from './contatos/entities/contato.entity';
import { Endereco } from './enderecos/entities/endereco.entity';

// Importa todos os módulos
import { PaisesModule } from './pais/paises.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { EmpresasModule } from './empresas/empresas.module';
import { CargosModule } from './cargos/cargos.module';
import { UsuariosModule } from './usuario/usuarios.module';
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
      database: 'petshop_db',
      entities: [Pais, Municipio, Empresa, Cargo, Usuario, Contato, Endereco],
      synchronize: false,
      logging: true,
    }),
    PaisesModule,
    MunicipiosModule,
    EmpresasModule,
    CargosModule,
    UsuariosModule,
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
