// src/municipio/municipio.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  Request,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { MunicipiosService } from './municipios.service';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipioService: MunicipiosService) {}

  @Post()
  async create(@Body() createMunicipioDto: CreateMunicipioDto, @Request() req) {
    return this.municipioService.create(createMunicipioDto, req.user.idEmpresa);
  }

  @Get()
  async findAll(@Request() req) {
    return this.municipioService.findAll(req.user.idEmpresa);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.municipioService.findOneById(id, req.user.idEmpresa);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMunicipioDto: UpdateMunicipioDto,
    @Request() req,
  ) {
    return this.municipioService.update(
      id,
      updateMunicipioDto,
      req.user.idEmpresa,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.municipioService.remove(id);
  }
}
