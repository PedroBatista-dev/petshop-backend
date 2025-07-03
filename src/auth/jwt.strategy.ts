// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuarioService: UsuarioService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; cargoDescricao: string; codigoEmpresaId?: string }) {
    const usuario = await this.usuarioService.findOneById(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado ou token inválido.');
    }
    return {
      userId: usuario.id,
      email: usuario.email,
      cargoDescricao: usuario.cargo.descricao,
      codigoEmpresaId: usuario.codigoEmpresaId,
    };
  }
}