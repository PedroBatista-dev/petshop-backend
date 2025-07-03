// src/enderecos/dto/update-endereco.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEnderecoDto } from './create-endereco.dto';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateEnderecoDto extends PartialType(CreateEnderecoDto) implements AuditableDto {
  // Campos de auditoria
  updateId?: string;
}