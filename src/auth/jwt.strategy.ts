// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuario/usuarios.service';

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

  async validate(payload: { sub: string; email: string; descricaoCargo: string; idEmpresa: string }) {
    const usuario = await this.usuarioService.findOneById(payload.sub, payload.idEmpresa);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado ou token inválido.');
    }
    return {
      id: usuario.id,
      email: usuario.email,
      descricaoCargo: usuario.cargo.descricao,
      idEmpresa: usuario.idEmpresa,
    };
  }
}