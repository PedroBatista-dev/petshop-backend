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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmpresasModule } from '../empresas/empresas.module';

@Module({
  imports: [
    UsuarioModule,
    EmpresasModule,
    CargoModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}