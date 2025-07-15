// src/enderecos/enderecos.controller.ts
import { Controller, UseGuards } from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enderecos')
export class EnderecosController {
  constructor(private readonly enderecosService: EnderecosService) {}
}
