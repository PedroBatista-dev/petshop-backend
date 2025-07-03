// src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, MaxLength, IsDateString, IsEnum, Matches, MinLength } from 'class-validator';
import { Sexo, EstadoCivil } from '../entities/usuario.entity';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) implements AuditableDto {
  @IsOptional()
  @IsString({ message: 'O nome completo deve ser uma string.' })
  @MaxLength(255, { message: 'O nome completo deve ter no máximo 255 caracteres.' })
  nomeCompleto?: string;

  @IsOptional()
  @IsString({ message: 'O CPF deve ser uma string.' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'O CPF deve estar no formato XXX.XXX.XXX-XX.' })
  cpf?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida (AAAA-MM-DD).' })
  dataNascimento?: string;

  @IsOptional()
  @IsEnum(Sexo, { message: 'Sexo inválido. Use M, F ou O.' })
  sexo?: Sexo;

  @IsOptional()
  @IsEnum(EstadoCivil, { message: 'Estado civil inválido.' })
  estadoCivil?: EstadoCivil;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres.' })
  telefone?: string;

  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
  password?: string;

  // Campos de auditoria
  quemAlterouId?: string;
}