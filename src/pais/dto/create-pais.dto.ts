// src/pais/dto/create-pais.dto.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreatePaisDto implements AuditableDto { // Implementa a interface para auditoria
  @IsNotEmpty({ message: 'A descrição do país é obrigatória.' })
  @IsString({ message: 'A descrição do país deve ser uma string.' })
  @MaxLength(100, { message: 'A descrição do país deve ter no máximo 100 caracteres.' })
  descricao: string;

  // Campos de auditoria (preenchidos pelo interceptor, não requerem validação aqui)
  createId?: string;
  updateId?: string;
}