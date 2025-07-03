// src/enderecos/enderecos.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Request, BadRequestException, UnauthorizedException, NotFoundException, Patch, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto'; // Importe
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints
@Controller('enderecos')
export class EnderecosController {
  constructor(private readonly enderecosService: EnderecosService) {}

  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente') // Define quem pode criar endereços
  @Post()
  async create(@Body() createEnderecoDto: CreateEnderecoDto, @Request() req) {
    if (createEnderecoDto.codigoEmpresaId && createEnderecoDto.codigoUsuarioId) {
        throw new BadRequestException('Um endereço deve ser associado a uma empresa OU a um usuário, não a ambos.');
    }
    if (!createEnderecoDto.codigoEmpresaId && !createEnderecoDto.codigoUsuarioId) {
        throw new BadRequestException('Um endereço deve ser associado a uma empresa OU a um usuário.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // Regras de autorização para criação de endereços:
    if (userRole === 'dono_master') {
        // DONO_MASTER pode criar qualquer endereço
    } else if (userRole === 'dono empresa' || userRole === 'gerente') {
        // DONO/GERENTE podem criar endereços para sua própria empresa ou para usuários dentro de sua empresa
        if (createEnderecoDto.codigoEmpresaId && createEnderecoDto.codigoEmpresaId !== req.user.codigoEmpresaId) {
            throw new UnauthorizedException('Você só pode criar endereços para sua própria empresa.');
        }
        if (createEnderecoDto.codigoUsuarioId) {
            const targetUser = await this.enderecosService['usuarioService'].findOneById(createEnderecoDto.codigoUsuarioId);
            if (!targetUser || targetUser.codigoEmpresaId !== req.user.codigoEmpresaId) {
                throw new UnauthorizedException('Você só pode criar endereços para usuários da sua própria empresa.');
            }
        }
    } else if (userRole === 'funcionario') {
        // FUNCIONARIO pode criar endereços para sua própria empresa ou para usuários dentro de sua empresa
        if (createEnderecoDto.codigoEmpresaId && createEnderecoDto.codigoEmpresaId !== req.user.codigoEmpresaId) {
            throw new UnauthorizedException('Você só pode criar endereços para sua própria empresa.');
        }
        if (createEnderecoDto.codigoUsuarioId) {
            const targetUser = await this.enderecosService['usuarioService'].findOneById(createEnderecoDto.codigoUsuarioId);
            if (!targetUser || targetUser.codigoEmpresaId !== req.user.codigoEmpresaId) {
                throw new UnauthorizedException('Você só pode criar endereços para usuários da sua própria empresa.');
            }
        }
    } else if (userRole === 'cliente') {
        // CLIENTE só pode criar endereços para si mesmo
        if (createEnderecoDto.codigoEmpresaId || (createEnderecoDto.codigoUsuarioId && createEnderecoDto.codigoUsuarioId !== req.user.userId)) {
            throw new UnauthorizedException('Clientes só podem adicionar endereços para si mesmos.');
        }
        createEnderecoDto.codigoUsuarioId = req.user.userId; // Força a associação a si mesmo
    } else {
        throw new UnauthorizedException('Você não tem permissão para criar endereços.');
    }

    return this.enderecosService.create(createEnderecoDto);
  }

  // Obter endereços relacionados a uma empresa específica
  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario')
  @Get('empresa/:companyId')
  async findAllForCompany(@Param('companyId') companyId: string, @Request() req) {
    const userRole = req.user.cargoDescricao.toLowerCase();
    if (userRole === 'dono_master' || req.user.codigoEmpresaId === companyId) {
      return this.enderecosService.findAllForCompany(companyId);
    }
    throw new UnauthorizedException('Você não tem permissão para listar endereços desta empresa.');
  }

  // Obter endereços relacionados a um usuário específico
  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente')
  @Get('usuario/:usuarioId')
  async findAllForUser(@Param('usuarioId') usuarioId: string, @Request() req) {
    const userRole = req.user.cargoDescricao.toLowerCase();
    if (userRole === 'dono_master' || req.user.userId === usuarioId) {
      return this.enderecosService.findAllForUser(usuarioId);
    }
    const targetUser = await this.enderecosService['usuarioService'].findOneById(usuarioId);
    if (targetUser && targetUser.codigoEmpresaId === req.user.codigoEmpresaId && (userRole === 'dono empresa' || userRole === 'gerente' || userRole === 'funcionario')) {
        return this.enderecosService.findAllForUser(usuarioId);
    }
    throw new UnauthorizedException('Você não tem permissão para listar endereços deste usuário.');
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const endereco = await this.enderecosService.findOneById(id);
    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // DONO_MASTER pode visualizar qualquer endereço
    if (userRole === 'dono_master') {
        return endereco;
    }

    // Usuários podem visualizar seus próprios endereços
    if (endereco.codigoUsuarioId === req.user.userId) {
        return endereco;
    }

    // Usuários associados à empresa podem visualizar endereços associados à sua empresa ou usuários de sua empresa
    if (req.user.codigoEmpresaId && (endereco.codigoEmpresaId === req.user.codigoEmpresaId || (endereco.codigoUsuarioId && endereco.usuario && endereco.usuario.codigoEmpresaId === req.user.codigoEmpresaId))) {
        return endereco;
    }

    throw new UnauthorizedException('Você não tem permissão para visualizar este endereço.');
  }

  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente') // Define quem pode alterar endereços
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnderecoDto: UpdateEnderecoDto, @Request() req) {
    const endereco = await this.enderecosService.findOneById(id);
    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // Regras de autorização para atualização:
    if (userRole === 'dono_master') {
      // DONO_MASTER pode atualizar qualquer endereço
    } else if (endereco.codigoUsuarioId === req.user.userId) {
      // Usuário pode atualizar seus próprios endereços
    } else if (req.user.codigoEmpresaId && (endereco.codigoEmpresaId === req.user.codigoEmpresaId || (endereco.codigoUsuarioId && endereco.usuario && endereco.usuario.codigoEmpresaId === req.user.codigoEmpresaId))) {
      // Usuários da empresa podem atualizar endereços da sua empresa ou de usuários na sua empresa
      if (userRole === 'cliente') { // Clientes não podem atualizar endereços de empresa ou outros usuários
        throw new UnauthorizedException('Clientes só podem atualizar seus próprios endereços.');
      }
    } else {
      throw new UnauthorizedException('Você não tem permissão para atualizar este endereço.');
    }

    return this.enderecosService.update(id, updateEnderecoDto);
  }

  @Roles('dono_master', 'dono empresa', 'gerente', 'funcionario', 'cliente') // Define quem pode remover endereços
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    const endereco = await this.enderecosService.findOneById(id);
    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    const userRole = req.user.cargoDescricao.toLowerCase();

    // Regras de autorização para remoção:
    if (userRole === 'dono_master') {
      // DONO_MASTER pode remover qualquer endereço
    } else if (endereco.codigoUsuarioId === req.user.userId) {
      // Usuário pode remover seus próprios endereços
    } else if (req.user.codigoEmpresaId && (endereco.codigoEmpresaId === req.user.codigoEmpresaId || (endereco.codigoUsuarioId && endereco.usuario && endereco.usuario.codigoEmpresaId === req.user.codigoEmpresaId))) {
      // Usuários da empresa podem remover endereços da sua empresa ou de usuários na sua empresa
      if (userRole === 'cliente') { // Clientes não podem remover endereços de empresa ou outros usuários
        throw new UnauthorizedException('Clientes só podem remover seus próprios endereços.');
      }
    } else {
      throw new UnauthorizedException('Você não tem permissão para remover este endereço.');
    }
    await this.enderecosService.remove(id);
  }
}