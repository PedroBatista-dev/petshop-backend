// src/auth/guards/company.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { SAME_COMPANY_KEY } from '../decorators/same-company.decorator';


@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiresSameCompany = this.reflector.getAllAndOverride<boolean>(SAME_COMPANY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiresSameCompany) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user || !user.id) {
      throw new UnauthorizedException('Usuário não autenticado ou informações ausentes.');
    }

    const userCompanyId = user.idEmpresa;

    if (!userCompanyId) {
      throw new ForbiddenException('Acesso negado. Seu usuário não está associado a uma empresa para esta operação.');
    }

    let resourceCodigoEmpresa: string | undefined;

    if (request.params && request.params.idEmpresa) { // Ex: /recursos/:idEmpresa
        resourceCodigoEmpresa = request.params.idEmpresa;
    } else if (request.body && request.body.idEmpresa) { // Ex: { idEmpresa: '...' }
        resourceCodigoEmpresa = request.body.idEmpresa;
    } else if (request.query && request.query.idEmpresa) { // Ex: ?idEmpresa=...
        resourceCodigoEmpresa = request.query.idEmpresa;
    }

    // Se a rota exige a verificação de empresa, mas não conseguimos encontrar o ID da empresa no recurso
    if (requiresSameCompany && !resourceCodigoEmpresa) {
        throw new ForbiddenException('Acesso negado. ID da empresa do recurso não encontrado na requisição.');
    }
    
    // 5. Compara o ID da empresa do usuário com o ID da empresa do recurso.
    if (userCompanyId === resourceCodigoEmpresa) {
      return true;
    } else {
      throw new ForbiddenException('Acesso negado. Você só pode acessar recursos da sua própria empresa.');
    }
  }
}