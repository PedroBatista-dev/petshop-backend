// src/municipio/dto/create-municipio.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreateMunicipioDto implements AuditableDto {
  @IsNotEmpty({ message: 'A descrição do município é obrigatória.' })
  @IsString({ message: 'A descrição do município deve ser uma string.' })
  @MaxLength(100, { message: 'A descrição do município deve ter no máximo 100 caracteres.' })
  descricao: string;

  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  @MaxLength(50, { message: 'O estado deve ter no máximo 50 caracteres.' })
  estado: string;

  @IsOptional()
  @IsString({ message: 'O código IBGE deve ser uma string.' })
  @MaxLength(20, { message: 'O código IBGE deve ter no máximo 20 caracteres.' })
  codigoIbge?: string;

  // Campos de auditoria
  createId?: string;
  updateId?: string;
}