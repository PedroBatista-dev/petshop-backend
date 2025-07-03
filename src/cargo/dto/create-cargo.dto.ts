// src/cargo/dto/create-cargo.dto.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreateCargoDto implements AuditableDto {
  @IsNotEmpty({ message: 'A descrição do cargo é obrigatória.' })
  @IsString({ message: 'A descrição do cargo deve ser uma string.' })
  @MaxLength(50, { message: 'A descrição do cargo deve ter no máximo 50 caracteres.' })
  descricao: string;

  // Campos de auditoria
  createId?: string;
  updateId?: string;
}