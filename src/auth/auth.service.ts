// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuario/usuarios.service';
import { CargosService } from '../cargos/cargos.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto'; // Importa o DTO de usuário
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../common/services/email.service';
import { v4 as uuid } from 'uuid';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateEmpresaDto } from '../empresas/dto/create-empresa.dto';
import { EmpresasService } from '../empresas/empresas.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private empresaService: EmpresasService,
    private cargoService: CargosService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private dataSource: DataSource,
  ) {}

  async validateUsuario(email: string, pass: string): Promise<any> {
    const usuario = await this.usuarioService.findOneByEmail(email);
    if (usuario && (await usuario.comparePassword(pass))) {
      const { passwordHash, resetPasswordToken, resetPasswordExpires, ...result } = usuario;
      return { ...result, descricaoCargo: usuario.cargo.descricao };
    }
    return null;
  }

  async login(authLoginDto: AuthLoginDto) {
    const usuario = await this.validateUsuario(authLoginDto.email, authLoginDto.password);
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      email: usuario.email,
      sub: usuario.id,
      descricaoCargo: usuario.descricaoCargo,
      idEmpresa: usuario.idEmpresa,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerCliente(createUsuarioDto: CreateUsuarioDto) {
    const clienteCargo = await this.cargoService.findOneByDescricao('Cliente', false, createUsuarioDto.idEmpresa);
    if (!clienteCargo) {
      throw new NotFoundException('Cargo "Cliente" não encontrado. Crie-o primeiro.');
    }

    createUsuarioDto.idEmpresa = createUsuarioDto.idEmpresa;
    createUsuarioDto.idCargo = clienteCargo.id;
    return this.usuarioService.create(createUsuarioDto);
  }
  
  async registerEmpresa(createEmpresaDto: CreateEmpresaDto) {
    const queryRunner = this.dataSource.createQueryRunner(); 
    await queryRunner.connect(); 

    await queryRunner.startTransaction(); 

    try {
      const adminCargo = await this.cargoService.findOneByDescricao('Admin', false);
      if (!adminCargo) {
        throw new NotFoundException('Cargo "Admin" não encontrado. Crie-o primeiro.');
      }

      const empresa = await this.empresaService.createWithQueryRunner(createEmpresaDto, queryRunner);

      const generatedPassword = this.generateRandomPassword();
      
      const adminUser = await this.usuarioService.createAdmin(
        empresa,
        adminCargo.id,
        empresa.email,
        generatedPassword,
        empresa.createdAt,
        queryRunner
      );
      
      await this.emailService.sendCreateEmpresaEmail(empresa.email, adminUser.email, generatedPassword);
  
      await queryRunner.commitTransaction();

      return empresa;

    } catch (error) {
      await queryRunner.rollbackTransaction(); // Desfaz a transação em caso de erro
      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
        throw error; // Propaga erros de validação/negócio para o frontend
      }
      // Loga o erro interno e lança uma exceção genérica para o frontend
      console.error('Erro ao registrar empresa e admin (transação desfeita):', error);
      throw new InternalServerErrorException('Não foi possível registrar a empresa e o usuário admin. Tente novamente mais tarde.');

    } finally {
      await queryRunner.release(); // Libera o queryRunner
    }

  }

  private generateRandomPassword(): string {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const usuario = await this.usuarioService.findOneByEmail(forgotPasswordDto.email);
    if (!usuario) {
      return;
    }

    const resetToken = uuid();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await this.usuarioService.updateResetToken(usuario.id, resetToken, resetExpires);

    const resetLink = `http://localhost:4200/auth/reset-password?token=${resetToken}`;
    await this.emailService.sendPasswordResetEmail(usuario.email, resetLink);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const usuario = await this.usuarioService.findByResetToken(resetPasswordDto.token);

    if (!usuario) {
      throw new BadRequestException('Token de recuperação inválido ou já utilizado.');
    }

    if (usuario.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token de recuperação expirado.');
    }

    usuario.passwordHash = await Usuario.hashPassword(resetPasswordDto.newPassword);
    usuario.resetPasswordToken = null;
    usuario.resetPasswordExpires = null;

    await this.usuarioService['usuariosRepository'].save(usuario);
  }
}