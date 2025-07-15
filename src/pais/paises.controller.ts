// src/pais/pais.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
  Request,
  Delete,
} from '@nestjs/common';
import { PaisesService } from './paises.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('paises')
export class PaisesController {
  constructor(private readonly paisService: PaisesService) {}

  @Post()
  async create(@Body() createPaisDto: CreatePaisDto, @Request() req) {
    return this.paisService.create(createPaisDto, req.user.idEmpresa);
  }

  @Get()
  async findAll(@Request() req) {
    return this.paisService.findAll(req.user.idEmpresa);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.paisService.findOneById(id, req.user.idEmpresa);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaisDto: UpdatePaisDto,
    @Request() req,
  ) {
    return this.paisService.update(id, updatePaisDto, req.user.idEmpresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.paisService.remove(id);
  }
}
