// src/empresas/dto/update-empresa.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresaDto } from './create-empresa.dto';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateEmpresaDto
  extends PartialType(CreateEmpresaDto)
  implements AuditableDto
{
  updateId?: string;
}
