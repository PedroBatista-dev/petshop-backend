// src/contatos/contatos.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Request, BadRequestException, UnauthorizedException, NotFoundException, Patch, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ContatosService } from './contatos.service';
import { CreateContatoDto } from './dto/create-contato.dto';
import { UpdateContatoDto } from './dto/update-contato.dto'; // Importe
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints
@Controller('contatos')
export class ContatosController {
  constructor(private readonly contatosService: ContatosService) {}

  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente') // Define quem pode criar contatos
  @Post()
  async create(@Body() createContatoDto: CreateContatoDto, @Request() req) {
    // Um contato deve ser associado a uma empresa OU a um usuário, não a ambos
    if (createContatoDto.codigoEmpresaId && createContatoDto.codigoUsuarioId) {
        throw new BadRequestException('Um contato deve ser associado a uma empresa OU a um usuário, não a ambos.');
    }
    if (!createContatoDto.codigoEmpresaId && !createContatoDto.codigoUsuarioId) {
        throw new BadRequestException('Um contato deve ser associado a uma empresa OU a um usuário.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // Regras de autorização para criação de contatos:
    if (userRole === 'dono_master') {
        // DONO_MASTER pode criar qualquer contato
    } else if (userRole === 'dono empresa' || userRole === 'gerente') {
        // DONO/GERENTE podem criar contatos para sua própria empresa ou para usuários dentro de sua empresa
        if (createContatoDto.codigoEmpresaId && createContatoDto.codigoEmpresaId !== req.user.codigoEmpresaId) {
            throw new UnauthorizedException('Você só pode criar contatos para sua própria empresa.');
        }
        if (createContatoDto.codigoUsuarioId) {
            const targetUser = await this.contatosService['usuarioService'].findOneById(createContatoDto.codigoUsuarioId);
            if (!targetUser || targetUser.codigoEmpresaId !== req.user.codigoEmpresaId) {
                throw new UnauthorizedException('Você só pode criar contatos para usuários da sua própria empresa.');
            }
        }
    } else if (userRole === 'funcionario') {
        // FUNCIONARIO pode criar contatos para sua própria empresa ou para usuários dentro de sua empresa
        if (createContatoDto.codigoEmpresaId && createContatoDto.codigoEmpresaId !== req.user.codigoEmpresaId) {
            throw new UnauthorizedException('Você só pode criar contatos para sua própria empresa.');
        }
        if (createContatoDto.codigoUsuarioId) {
            const targetUser = await this.contatosService['usuarioService'].findOneById(createContatoDto.codigoUsuarioId);
            if (!targetUser || targetUser.codigoEmpresaId !== req.user.codigoEmpresaId) {
                throw new UnauthorizedException('Você só pode criar contatos para usuários da sua própria empresa.');
            }
        }
    } else if (userRole === 'cliente') {
        // CLIENTE só pode criar contatos para si mesmo
        if (createContatoDto.codigoEmpresaId || (createContatoDto.codigoUsuarioId && createContatoDto.codigoUsuarioId !== req.user.userId)) {
            throw new UnauthorizedException('Clientes só podem adicionar contatos para si mesmos.');
        }
        createContatoDto.codigoUsuarioId = req.user.userId; // Força a associação a si mesmo
    } else {
        throw new UnauthorizedException('Você não tem permissão para criar contatos.');
    }

    return this.contatosService.create(createContatoDto);
  }

  // Obter contatos relacionados a uma empresa específica
  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario')
  @Get('empresa/:companyId')
  async findAllForCompany(@Param('companyId') companyId: string, @Request() req) {
    const userRole = req.user.cargoDescricao.toLowerCase();
    if (userRole === 'dono_master' || req.user.codigoEmpresaId === companyId) {
      return this.contatosService.findAllForCompany(companyId);
    }
    throw new UnauthorizedException('Você não tem permissão para listar contatos desta empresa.');
  }

  // Obter contatos relacionados a um usuário específico
  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente')
  @Get('usuario/:usuarioId')
  async findAllForUser(@Param('usuarioId') usuarioId: string, @Request() req) {
    const userRole = req.user.cargoDescricao.toLowerCase();
    if (userRole === 'dono_master' || req.user.userId === usuarioId) {
      return this.contatosService.findAllForUser(usuarioId);
    }
    const targetUser = await this.contatosService['usuarioService'].findOneById(usuarioId);
    if (targetUser && targetUser.codigoEmpresaId === req.user.codigoEmpresaId && (userRole === 'dono empresa' || userRole === 'gerente' || userRole === 'funcionario')) {
        return this.contatosService.findAllForUser(usuarioId);
    }
    throw new UnauthorizedException('Você não tem permissão para listar contatos deste usuário.');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const contato = await this.contatosService.findOneById(id);
    if (!contato) {
      throw new NotFoundException('Contato não encontrado.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // DONO_MASTER pode visualizar qualquer contato
    if (userRole === 'dono_master') {
        return contato;
    }

    // Usuários podem visualizar seus próprios contatos
    if (contato.codigoUsuarioId === req.user.userId) {
        return contato;
    }

    // Usuários associados à empresa podem visualizar contatos associados à sua empresa ou usuários de sua empresa
    if (req.user.codigoEmpresaId && (contato.codigoEmpresaId === req.user.codigoEmpresaId || (contato.codigoUsuarioId && contato.usuario && contato.usuario.codigoEmpresaId === req.user.codigoEmpresaId))) {
        return contato;
    }

    throw new UnauthorizedException('Você não tem permissão para visualizar este contato.');
  }

  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContatoDto: UpdateContatoDto, @Request() req) {
    const contato = await this.contatosService.findOneById(id);
    if (!contato) {
      throw new NotFoundException('Contato não encontrado.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // Regras de autorização para atualização:
    if (userRole === 'dono_master') {
      // DONO_MASTER pode atualizar qualquer contato
    } else if (contato.codigoUsuarioId === req.user.userId) {
      // Usuário pode atualizar seus próprios contatos
    } else if (req.user.codigoEmpresaId && (contato.codigoEmpresaId === req.user.codigoEmpresaId || (contato.codigoUsuarioId && contato.usuario && contato.usuario.codigoEmpresaId === req.user.codigoEmpresaId))) {
      // Usuários da empresa podem atualizar contatos da sua empresa ou de usuários na sua empresa
      if (userRole === 'cliente') { // Clientes não podem atualizar contatos de empresa ou outros usuários
        throw new UnauthorizedException('Clientes só podem atualizar seus próprios contatos.');
      }
    } else {
      throw new UnauthorizedException('Você não tem permissão para atualizar este contato.');
    }

    return this.contatosService.update(id, updateContatoDto);
  }

  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente') // Define quem pode remover contatos
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    const contato = await this.contatosService.findOneById(id);
    if (!contato) {
      throw new NotFoundException('Contato não encontrado.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // Regras de autorização para remoção:
    if (userRole === 'dono_master') {
      // DONO_MASTER pode remover qualquer contato
    } else if (contato.codigoUsuarioId === req.user.userId) {
      // Usuário pode remover seus próprios contatos
    } else if (req.user.codigoEmpresaId && (contato.codigoEmpresaId === req.user.codigoEmpresaId || (contato.codigoUsuarioId && contato.usuario && contato.usuario.codigoEmpresaId === req.user.codigoEmpresaId))) {
      // Usuários da empresa podem remover contatos da sua empresa ou de usuários na sua empresa
      if (userRole === 'cliente') { // Clientes não podem remover contatos de empresa ou outros usuários
        throw new UnauthorizedException('Clientes só podem remover seus próprios contatos.');
      }
    } else {
      throw new UnauthorizedException('Você não tem permissão para remover este contato.');
    }
    await this.contatosService.remove(id);
  }
}