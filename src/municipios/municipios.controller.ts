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
import { JwtUserPayload } from '../types/user';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipioService: MunicipiosService) {}

  @Post()
  async create(
    @Body() createMunicipioDto: CreateMunicipioDto,
    @Request() req: ExpressRequest,
  ) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.municipioService.create(createMunicipioDto, user.idEmpresa);
  }

  @Get()
  async findAll(@Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.municipioService.findAll(user.idEmpresa);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.municipioService.findOneById(id, user.idEmpresa);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMunicipioDto: UpdateMunicipioDto,
    @Request() req: ExpressRequest,
  ) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.municipioService.update(id, updateMunicipioDto, user.idEmpresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.municipioService.remove(id);
  }
}
