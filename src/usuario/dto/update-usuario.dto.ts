// src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsBase64, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateUsuarioDto
  extends PartialType(CreateUsuarioDto)
  implements AuditableDto
{
  @IsNotEmpty({ message: 'Código da usuário é obrigatório.' })
  @IsUUID('4', { message: 'Código da usuário inválido.' })
  id: string;

  @IsOptional()
  passwordHash?: string;

  @IsOptional()
  @IsBase64()
  foto?: string;
}
