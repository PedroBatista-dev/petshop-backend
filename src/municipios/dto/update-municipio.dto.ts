// src/municipio/dto/update-municipio.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMunicipioDto } from './create-municipio.dto';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateMunicipioDto
  extends PartialType(CreateMunicipioDto)
  implements AuditableDto
{
  // Campos de auditoria
  updateId?: string;
}
