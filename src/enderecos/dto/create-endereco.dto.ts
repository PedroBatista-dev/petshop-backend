// src/enderecos/dto/create-endereco.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PrincipalEndereco, TipoEndereco } from '../entities/endereco.entity';
import { AuditableDto } from '../../common/audit/audit.interceptor';

export class CreateEnderecoDto implements AuditableDto {
  @IsNotEmpty({ message: 'O campo Principal é obrigatório (S ou N).' })
  @IsEnum(PrincipalEndereco, { message: 'Valor inválido para Principal. Use S ou N.' })
  principal: PrincipalEndereco;

  @IsNotEmpty({ message: 'O tipo de endereço é obrigatório.' })
  @IsEnum(TipoEndereco, { message: 'Tipo de endereço inválido. Use Residencial ou Comercial.' })
  tipo: TipoEndereco;

  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  @MaxLength(10, { message: 'O CEP deve ter no máximo 10 caracteres.' })
  cep: string;

  @IsNotEmpty({ message: 'O logradouro é obrigatório.' })
  @IsString({ message: 'O logradouro deve ser uma string.' })
  @MaxLength(255, { message: 'O logradouro deve ter no máximo 255 caracteres.' })
  logradouro: string;

  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @IsString({ message: 'O número deve ser uma string.' })
  @MaxLength(20, { message: 'O número deve ter no máximo 20 caracteres.' })
  numero: string;

  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @MaxLength(100, { message: 'O complemento deve ter no máximo 100 caracteres.' })
  complemento?: string;

  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @IsString({ message: 'O bairro deve ser uma string.' })
  @MaxLength(100, { message: 'O bairro deve ter no máximo 100 caracteres.' })
  bairro: string;

  @IsNotEmpty({ message: 'O código do país é obrigatório.' })
  @IsUUID('4', { message: 'Código do país inválido.' })
  idPais: string;

  @IsNotEmpty({ message: 'O código do município é obrigatório.' })
  @IsUUID('4', { message: 'Código do município inválido.' })
  idMunicipio: string;

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