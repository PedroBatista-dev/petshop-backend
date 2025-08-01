// src/usuario/usuario.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtUserPayload } from '../types/user';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuarioService: UsuariosService) {}

  @Roles('admin')
  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Roles('admin')
  @Get()
  async findAll(@Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    if (user.idEmpresa) {
      return this.usuarioService.findAll(user.idEmpresa);
    }
    return [];
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    const usuario = await this.usuarioService.findOneById(id, user.idEmpresa);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (
      user.descricaoCargo.toLowerCase() !== 'admin' &&
      user.id !== id &&
      usuario.idEmpresa !== user.idEmpresa
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar este perfil.',
      );
    }
    return usuario;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req: ExpressRequest,
  ) {
    const user: JwtUserPayload = req.user as JwtUserPayload;

    if (user.id === id) {
      return this.usuarioService.update(id, updateUsuarioDto, user.idEmpresa);
    }

    if (user.descricaoCargo.toLowerCase() === 'admin') {
      return this.usuarioService.update(id, updateUsuarioDto, user.idEmpresa);
    }

    const targetUser = await this.usuarioService.findOneById(
      id,
      user.idEmpresa,
    );
    if (!targetUser) {
      throw new NotFoundException('Usuário a ser atualizado não encontrado.');
    }

    throw new UnauthorizedException(
      'Você não tem permissão para atualizar este usuário.',
    );
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    const userToDelete = await this.usuarioService.findOneById(
      id,
      user.idEmpresa,
    );
    if (!userToDelete) {
      throw new NotFoundException('Usuário não encontrado para remoção.');
    }

    if (userToDelete.idEmpresa !== user.idEmpresa) {
      throw new UnauthorizedException(
        'Você não pode remover usuários de outras empresas.',
      );
    }

    if (user.id === id) {
      throw new BadRequestException(
        'Você não pode remover seu próprio usuário.',
      );
    }

    if (user.descricaoCargo.toLowerCase() === 'admin') {
      await this.usuarioService.remove(id);
      return;
    }

    throw new UnauthorizedException(
      'Você não tem permissão para remover este usuário.',
    );
  }
}
