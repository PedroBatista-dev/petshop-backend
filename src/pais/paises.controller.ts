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
import { JwtUserPayload } from '../types/user';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('paises')
export class PaisesController {
  constructor(private readonly paisService: PaisesService) {}

  @Post()
  async create(
    @Body() createPaisDto: CreatePaisDto,
    @Request() req: ExpressRequest,
  ) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.paisService.create(createPaisDto, user.idEmpresa);
  }

  @Get()
  async findAll(@Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.paisService.findAll(user.idEmpresa);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.paisService.findOneById(id, user.idEmpresa);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaisDto: UpdatePaisDto,
    @Request() req: ExpressRequest,
  ) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.paisService.update(id, updatePaisDto, user.idEmpresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.paisService.remove(id);
  }
}
