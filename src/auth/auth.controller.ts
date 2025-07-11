// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateEmpresaDto } from '../empresas/dto/create-empresa.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Post('register/master-owner')
  async registerMasterOwner(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.registerMasterOwner(createUsuarioDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('dono_master')
  @Post('register/dono-empresa')
  async registerDonoEmpresa(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    return this.authService.registerDonoEmpresa(createUsuarioDto, req.user.cargoDescricao);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('dono_master', 'dono empresa')
  @Post('register/gerente')
  async registerGerente(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    return this.authService.registerGerente(createUsuarioDto, req.user.cargoDescricao, req.user.codigoEmpresaId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('dono_master', 'dono empresa', 'gerente')
  @Post('register/funcionario')
  async registerFuncionario(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    return this.authService.registerFuncionario(createUsuarioDto, req.user.cargoDescricao, req.user.codigoEmpresaId);
  }

  @Post('register/cliente')
  async registerCliente(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    if (req.user && req.user.cargoDescricao) {
      return this.authService.registerCliente(createUsuarioDto, req.user.cargoDescricao, req.user.codigoEmpresaId);
    }
    return this.authService.registerCliente(createUsuarioDto);
  }
  
  @Post('register/empresa')
  async registerEmpresa(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.authService.registerEmpresa(createEmpresaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
  }
}