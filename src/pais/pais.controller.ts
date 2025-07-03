// src/pais/pais.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Patch, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { PaisService } from './pais.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto'; // Importe
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints
@Controller('paises')
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Roles('dono_master') // Apenas DONO_MASTER pode gerenciar países
  @Post()
  async create(@Body() createPaisDto: CreatePaisDto) {
    return this.paisService.create(createPaisDto);
  }

  @Get() // Qualquer usuário autenticado pode listar países
  async findAll() {
    return this.paisService.findAll();
  }

  @Get(':id') // Qualquer usuário autenticado pode visualizar um país específico
  async findOne(@Param('id') id: string) {
    return this.paisService.findOneById(id);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode alterar países
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePaisDto: UpdatePaisDto) {
    return this.paisService.update(id, updatePaisDto);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode remover países
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.paisService.remove(id);
  }
}