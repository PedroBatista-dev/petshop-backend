// src/usuario/dto/create-usuario.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
  Matches,
  IsString,
} from 'class-validator';
import { Sexo, EstadoCivil } from '../entities/usuario.entity';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreateUsuarioDto implements AuditableDto {
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  @IsString({ message: 'O nome completo deve ser uma string.' })
  @MaxLength(255, {
    message: 'O nome completo deve ter no máximo 255 caracteres.',
  })
  nomeCompleto: string;

  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsString({ message: 'O CPF deve ser uma string.' })
  @Matches(/^\d{11}$/, {
    message: 'O CPF deve conter exatamente 11 dígitos numéricos.',
  })
  cpf: string;

  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  @IsDateString(
    {},
    { message: 'A data de nascimento deve ser uma data válida (AAAA-MM-DD).' },
  )
  dataNascimento: string;

  @IsNotEmpty({ message: 'O sexo é obrigatório.' })
  @IsEnum(Sexo, { message: 'Sexo inválido. Use M, F ou O.' })
  sexo: Sexo;

  @IsNotEmpty({ message: 'O estado civil é obrigatório.' })
  @IsEnum(EstadoCivil, { message: 'Estado civil inválido.' })
  estadoCivil: EstadoCivil;

  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @IsString({ message: 'O telefone deve ser uma string.' })
  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres.' })
  telefone: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
  password: string;

  @IsOptional()
  @IsUUID('4', { message: 'Código de cargo inválido.' })
  idCargo?: string;

  @IsNotEmpty({ message: 'Código da empresa é obrigatório.' })
  @IsUUID('4', { message: 'Código da empresa inválido.' })
  idEmpresa?: string;

  @IsOptional()
  @IsString()
  createId?: string;

  @IsOptional()
  @IsString()
  updateId?: string;
}
