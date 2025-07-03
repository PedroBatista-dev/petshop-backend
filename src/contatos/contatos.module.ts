// src/contatos/contatos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContatosService } from './contatos.service';
import { ContatosController } from './contatos.controller';
import { Contatos } from './entities/contatos.entity';
import { EmpresasModule } from '../empresas/empresas.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contatos]),
    EmpresasModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [ContatosController],
  providers: [ContatosService],
  exports: [ContatosService],
})
export class ContatosModule {}