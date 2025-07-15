// src/cargo/dto/update-cargo.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCargoDto } from './create-cargo.dto';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateCargoDto
  extends PartialType(CreateCargoDto)
  implements AuditableDto
{
  updateId?: string;
}
