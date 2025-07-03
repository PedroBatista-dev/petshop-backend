// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { CargoModule } from '../cargo/cargo.module';
import { JwtStrategy } from './jwt.strategy';
import { CommonModule } from '../common/common.module';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    UsuarioModule,
    CargoModule,
    PassportModule,
    JwtModule.register(jwtConfig),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}