// src/contatos/dto/update-contato.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateContatoDto } from './create-contato.dto';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateContatoDto extends PartialType(CreateContatoDto) implements AuditableDto {
  // Campos de auditoria
  updateId?: string;
}