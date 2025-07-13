// src/contatos/dto/create-contato.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Principal } from '../entities/contato.entity';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreateContatoDto implements AuditableDto {
  @IsNotEmpty({ message: 'O campo Principal é obrigatório (S ou N).' })
  @IsEnum(Principal, { message: 'Valor inválido para Principal. Use S ou N.' })
  principal: Principal;

  @IsNotEmpty({ message: 'O nome do contato é obrigatório.' })
  @IsString({ message: 'O nome do contato deve ser uma string.' })
  @MaxLength(100, { message: 'O nome do contato deve ter no máximo 100 caracteres.' })
  nome: string;

  @IsNotEmpty({ message: 'O telefone do contato é obrigatório.' })
  @IsString({ message: 'O telefone do contato deve ser uma string.' })
  @MaxLength(20, { message: 'O telefone do contato deve ter no máximo 20 caracteres.' })
  telefone: string;

  @IsNotEmpty({ message: 'O e-mail do contato é obrigatório.' })
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email: string;

  @IsOptional()
  @IsUUID('4', { message: 'Código da empresa inválido.' })
  idEmpresa?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Código do usuário inválido.' })
  idUsuario?: string;

  @IsOptional()
  @IsString()
  createId?: string;

  @IsOptional()
  @IsString()
  updateId?: string;
}