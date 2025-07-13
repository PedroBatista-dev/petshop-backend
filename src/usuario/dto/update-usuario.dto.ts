// src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) implements AuditableDto {

  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
  password?: string;
}