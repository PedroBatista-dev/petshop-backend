// src/empresas/dto/create-empresa.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsEmail, IsOptional, IsAlphanumeric } from 'class-validator';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreateEmpresaDto implements AuditableDto {
  @IsNotEmpty({ message: 'A razão social é obrigatória.' })
  @IsString({ message: 'A razão social deve ser uma string.' })
  @MaxLength(255, { message: 'A razão social deve ter no máximo 255 caracteres.' })
  razaoSocial: string;

  @IsNotEmpty({ message: 'A descrição da empresa é obrigatória.' })
  @IsString({ message: 'A descrição da empresa deve ser uma string.' })
  descricaoEmpresa: string;

  @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
  @IsString({ message: 'O CNPJ deve ser uma string.' })
  @MaxLength(18, { message: 'O CNPJ deve ter no máximo 18 caracteres (incluindo formatação).' })
  cnpj: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @IsString({ message: 'O telefone deve ser uma string.' })
  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres.' })
  telefone: string;

  @IsOptional()
  @IsAlphanumeric('pt-BR', { message: 'A sigla deve conter apenas letras e números.' })
  @MaxLength(10, { message: 'A sigla deve ter no máximo 10 caracteres.' })
  sigla: string;

  @IsOptional()
  @IsString({ message: 'A inscrição municipal deve ser uma string.' })
  inscricaoMunicipal?: string;

  @IsOptional()
  @IsString({ message: 'A inscrição estadual deve ser uma string.' })
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString({ message: 'O caminho da foto deve ser uma string.' })
  foto?: string;

  @IsOptional()
  @IsString({ message: 'A observação deve ser uma string.' })
  observacao?: string;

  @IsOptional()
  @IsString()
  createId?: string;

  @IsOptional()
  @IsString()
  updateId?: string;
}