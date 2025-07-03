// src/cargo/cargo.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards, Patch, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto'; // Importe
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard) // Protege todos os endpoints
@Controller('cargos')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Roles('dono_master') // Apenas DONO_MASTER pode criar/gerenciar cargos
  @Post()
  async create(@Body() createCargoDto: CreateCargoDto) {
    return this.cargoService.create(createCargoDto);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode listar todos os cargos
  @Get()
  async findAll() {
    return this.cargoService.findAll();
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode visualizar um cargo específico
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cargoService.findOneById(id);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode alterar cargos
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
    return this.cargoService.update(id, updateCargoDto);
  }

  @Roles('dono_master') // Apenas DONO_MASTER pode remover cargos
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.cargoService.remove(id);
  }
}