// src/auth/dto/reset-password.dto.ts
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'O token é obrigatório.' })
  token: string;

  @IsNotEmpty({ message: 'A nova senha não pode ser vazia.' })
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
  @MaxLength(20, { message: 'A nova senha deve ter no máximo 20 caracteres.' })
  newPassword: string;
}
