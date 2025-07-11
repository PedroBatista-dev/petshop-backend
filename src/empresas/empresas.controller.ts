// src/empresas/empresas.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Patch, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto'; // Importe
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Roles('dono_master') // Apenas DONO_MASTER pode criar empresas
  @Post()
  async create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresasService.create(createEmpresaDto);
  }

  @Get()
  async findAll() {
    return this.empresasService.findAll();
  }

  @Get(':id') // Qualquer usuário autenticado pode visualizar uma empresa específica (se permitido pela lógica de negócios)
  async findOne(@Param('id') id: string) {
    return this.empresasService.findOneById(id);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode alterar empresas
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasService.update(id, updateEmpresaDto);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode remover empresas
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.empresasService.remove(id);
  }
}