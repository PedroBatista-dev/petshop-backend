// src/usuario/usuario.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards, Request, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints neste controller
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Este endpoint POST é para criação de usuários via administração (fora do fluxo de registro de autenticação)
  // Deve ser fortemente restrito. A forma primária de criar usuários será pelas rotas de registro do AuthController.
  @Roles('dono_master') // Apenas DONO_MASTER pode criar usuários diretamente via este endpoint
  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  async findAll(@Request() req) {
    // DONO_MASTER pode ver todos os usuários. Outros cargos veem apenas usuários da sua empresa.
    if (req.user.cargoDescricao.toLowerCase() === 'dono_master') {
      return this.usuarioService.findAll();
    } else if (req.user.codigoEmpresaId) {
      return this.usuarioService.findAll(req.user.codigoEmpresaId);
    }
    return []; // Clientes ou usuários sem codigoEmpresaId não listam todos
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const usuario = await this.usuarioService.findOneById(id);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    // Controle de acesso:
    // DONO_MASTER pode visualizar qualquer um.
    // Usuários podem visualizar seu próprio perfil.
    // DONO_EMPRESA, GERENTE, FUNCIONARIO podem visualizar outros usuários dentro de sua própria empresa.
    if (
      req.user.cargoDescricao.toLowerCase() !== 'dono_master' &&
      req.user.userId !== id &&
      usuario.codigoEmpresaId !== req.user.codigoEmpresaId // Restringe à mesma empresa
    ) {
      throw new UnauthorizedException('Você não tem permissão para acessar este perfil.');
    }
    return usuario;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto, @Request() req) {
    // Permissões básicas: Um usuário pode atualizar seu próprio perfil.
    // DONO_MASTER pode atualizar qualquer usuário.
    // DONO_EMPRESA/GERENTE podem atualizar usuários dentro de sua empresa (exceto DONO_MASTER).
    if (req.user.userId === id) { // Usuário atualizando seu próprio perfil
      return this.usuarioService.update(id, updateUsuarioDto);
    }

    // Para outros usuários, verifica permissões com base nos cargos
    if (req.user.cargoDescricao.toLowerCase() === 'dono_master') {
      return this.usuarioService.update(id, updateUsuarioDto);
    }

    const targetUser = await this.usuarioService.findOneById(id);
    if (!targetUser) {
      throw new NotFoundException('Usuário a ser atualizado não encontrado.');
    }

    if (
      req.user.codigoEmpresaId &&
      targetUser.codigoEmpresaId === req.user.codigoEmpresaId && // Deve ser da mesma empresa
      (req.user.cargoDescricao.toLowerCase() === 'dono empresa' || req.user.cargoDescricao.toLowerCase() === 'gerente') &&
      targetUser.cargo.descricao.toLowerCase() !== 'dono_master' && // Não pode atualizar DONO_MASTER
      (req.user.cargoDescricao.toLowerCase() === 'gerente' ? targetUser.cargo.descricao.toLowerCase() !== 'dono empresa' : true) // Gerente não pode atualizar Dono_Empresa
    ) {
      return this.usuarioService.update(id, updateUsuarioDto);
    }

    throw new UnauthorizedException('Você não tem permissão para atualizar este usuário.');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    const userToDelete = await this.usuarioService.findOneById(id);
    if (!userToDelete) {
        throw new NotFoundException('Usuário não encontrado para remoção.');
    }

    // Lógica de autorização para exclusão
    if (req.user.cargoDescricao.toLowerCase() === 'dono_master') {
        // DONO_MASTER pode deletar qualquer um, incluindo outros DONO_MASTER para cenários de reset do sistema
        await this.usuarioService.remove(id);
        return;
    }

    if (userToDelete.codigoEmpresaId !== req.user.codigoEmpresaId) {
        throw new UnauthorizedException('Você não pode remover usuários de outras empresas.');
    }

    // Impede a auto-exclusão se não for DONO_MASTER
    if (req.user.userId === id) {
        throw new BadRequestException('Você não pode remover seu próprio usuário.');
    }

    // DONO_EMPRESA pode deletar Gerentes, Funcionarios, Clientes de sua empresa
    if (req.user.cargoDescricao.toLowerCase() === 'dono empresa') {
        if (userToDelete.cargo.descricao.toLowerCase() === 'dono empresa') {
            throw new UnauthorizedException('Um DONO_EMPRESA não pode remover outro DONO_EMPRESA.');
        }
        await this.usuarioService.remove(id);
        return;
    }

    // GERENTE pode deletar Funcionarios, Clientes de sua empresa
    if (req.user.cargoDescricao.toLowerCase() === 'gerente') {
        if (userToDelete.cargo.descricao.toLowerCase() === 'dono empresa' || userToDelete.cargo.descricao.toLowerCase() === 'gerente') {
            throw new UnauthorizedException('Um GERENTE só pode remover Funcionários e Clientes.');
        }
        await this.usuarioService.remove(id);
        return;
    }

    throw new UnauthorizedException('Você não tem permissão para remover este usuário.');
  }
}