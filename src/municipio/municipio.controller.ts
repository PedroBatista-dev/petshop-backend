// src/municipio/municipio.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Patch, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { MunicipioService } from './municipio.service';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto'; // Importe
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints
@Controller('municipios')
export class MunicipioController {
  constructor(private readonly municipioService: MunicipioService) {}

  @Roles('dono_master') // Apenas DONO_MASTER pode gerenciar municípios
  @Post()
  async create(@Body() createMunicipioDto: CreateMunicipioDto) {
    return this.municipioService.create(createMunicipioDto);
  }

  @Get() // Qualquer usuário autenticado pode listar municípios
  async findAll() {
    return this.municipioService.findAll();
  }

  @Get(':id') // Qualquer usuário autenticado pode visualizar um município específico
  async findOne(@Param('id') id: string) {
    return this.municipioService.findOneById(id);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode alterar municípios
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMunicipioDto: UpdateMunicipioDto) {
    return this.municipioService.update(id, updateMunicipioDto);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode remover municípios
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.municipioService.remove(id);
  }
}