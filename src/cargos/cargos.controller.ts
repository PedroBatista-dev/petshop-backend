// src/cargo/cargo.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
  HttpCode,
  Request,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { CargosService } from './cargos.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtUserPayload } from '../types/user';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cargos')
export class CargosController {
  constructor(private readonly cargosService: CargosService) {}

  @Roles('admin')
  @Post()
  async create(
    @Body() createCargoDto: CreateCargoDto,
    @Request() req: ExpressRequest,
  ) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.cargosService.create(createCargoDto, user.idEmpresa);
  }

  @Roles('admin')
  @Get()
  async findAll(@Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.cargosService.findAll(user.idEmpresa);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.cargosService.findOneById(id, user.idEmpresa);
  }

  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCargoDto: UpdateCargoDto,
    @Request() req: ExpressRequest,
  ) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    return this.cargosService.update(id, updateCargoDto, user.idEmpresa);
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: ExpressRequest) {
    const user: JwtUserPayload = req.user as JwtUserPayload;
    await this.cargosService.remove(id, user.idEmpresa);
  }
}
