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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cargos')
export class CargosController {
  constructor(private readonly cargosService: CargosService) {}

  @Roles('admin')
  @Post()
  async create(@Body() createCargoDto: CreateCargoDto, @Request() req) {
    return this.cargosService.create(createCargoDto, req.user.idEmpresa);
  }

  @Roles('admin')
  @Get()
  async findAll(@Request() req) {
    return this.cargosService.findAll(req.user.idEmpresa);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.cargosService.findOneById(id, req.user.idEmpresa);
  }

  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCargoDto: UpdateCargoDto,
    @Request() req,
  ) {
    return this.cargosService.update(id, updateCargoDto, req.user.idEmpresa);
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    await this.cargosService.remove(id, req.user.idEmpresa);
  }
}
