// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtUserPayload } from '../../types/user';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request: ExpressRequest = context
      .switchToHttp()
      .getRequest<ExpressRequest>();

    const user: JwtUserPayload = request.user as JwtUserPayload;

    if (!user || !user.descricaoCargo) {
      throw new UnauthorizedException(
        'Usuário não autenticado ou sem cargo definido.',
      );
    }

    const userRoleLower = user.descricaoCargo.toLowerCase();

    if (requiredRoles.some((role) => userRoleLower === role.toLowerCase())) {
      return true;
    }

    throw new UnauthorizedException(
      `Acesso negado. Apenas usuários com os cargos: ${requiredRoles.join(', ')} podem acessar este recurso.`,
    );
  }
}
