import { Controller, UseGuards } from '@nestjs/common';
import { ContatosService } from './contatos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contatos')
export class ContatosController {
  constructor(private readonly contatosService: ContatosService) {}
}
