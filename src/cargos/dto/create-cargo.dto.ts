// src/cargo/dto/create-cargo.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreateCargoDto implements AuditableDto {
  @IsNotEmpty({ message: 'A descrição do cargo é obrigatória.' })
  @IsString({ message: 'A descrição do cargo deve ser uma string.' })
  @MaxLength(50, { message: 'A descrição do cargo deve ter no máximo 50 caracteres.' })
  descricao: string;

  @IsOptional()
  @IsUUID('4', { message: 'Código da empresa inválido.' })
  idEmpresa?: string;

  @IsOptional()
  @IsString()
  createId?: string;

  @IsOptional()
  @IsString()
  updateId?: string;
}