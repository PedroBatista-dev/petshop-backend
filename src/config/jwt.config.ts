// src/config/jwt.config.ts
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET, // Lê o segredo da variável de ambiente JWT_SECRET
  signOptions: { expiresIn: '1h' }, // O token JWT vai expirar em 1 hora
};