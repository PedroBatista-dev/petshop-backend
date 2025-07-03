// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Nenhuma role definida, acesso público
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.cargoDescricao) {
      throw new UnauthorizedException('Usuário não autenticado ou sem cargo definido.');
    }

    // Converte a descrição do cargo do usuário para minúsculas para comparação consistente
    const userRoleLower = user.cargoDescricao.toLowerCase();

    // Verifica se o cargo do usuário está na lista de cargos necessários
    if (requiredRoles.some((role) => userRoleLower === role.toLowerCase())) {
      return true;
    }

    throw new UnauthorizedException(`Acesso negado. Apenas usuários com os cargos: ${requiredRoles.join(', ')} podem acessar este recurso.`);
  }
}