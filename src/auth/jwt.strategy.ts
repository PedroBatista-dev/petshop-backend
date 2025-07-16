// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuario/usuarios.service';
import { JwtUserPayload } from '../../src/types/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuarioService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtUserPayload): Promise<JwtUserPayload> {
    const usuario = await this.usuarioService.findOneById(
      payload.id,
      payload.idEmpresa,
    );
    if (!usuario) {
      throw new UnauthorizedException(
        'Usuário não encontrado ou token inválido.',
      );
    }
    return {
      id: usuario.id,
      email: usuario.email,
      descricaoCargo: usuario.cargo.descricao,
      idEmpresa: usuario.idEmpresa,
      cpf: null,
      dataNascimento: null,
      estadoCivil: null,
      nomeCompleto: usuario.nomeCompleto,
      sexo: null,
      telefone: null,
    };
  }
}
