// src/contatos/contatos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContatosService } from './contatos.service';
import { ContatosController } from './contatos.controller';
import { Contato } from './entities/contato.entity';
import { EmpresasModule } from '../empresas/empresas.module';
import { UsuariosModule } from '../usuario/usuarios.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contato]),
    EmpresasModule,
    UsuariosModule,
    AuthModule,
  ],
  controllers: [ContatosController],
  providers: [ContatosService],
  exports: [ContatosService],
})
export class ContatosModule {}
