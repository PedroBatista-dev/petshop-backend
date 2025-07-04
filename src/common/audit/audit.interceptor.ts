// src/common/interceptors/audit.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

// Define uma interface para os DTOs que o interceptor vai manipular
// Assim, garantimos que os DTOs terão as propriedades esperadas.
export interface AuditableDto {
  createId?: string;
  updateId?: string;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.user ? (request.user as any).userId : null; // Obtém o ID do usuário do token JWT

    const isAuditableRequest = (body: any): body is AuditableDto => {
      // Verifica se o objeto tem (ou pode ter) as propriedades de auditoria.
      // É uma verificação um pouco flexível, mas ajuda a evitar injetar em DTOs de login.
      return typeof body === 'object' && body !== null && ('quemCriouId' in body || 'quemAlterouId' in body);
      // OU, se você tiver um tipo base para todos os seus DTOs auditáveis no frontend:
      // return body instanceof MyAuditableDtoBaseClass;
    };

    // Se o método da requisição for POST (criação)
    if (request.method === 'POST') {
      if (request.body && typeof request.body === 'object' && isAuditableRequest(request.body)) {
        const auditableBody = request.body as AuditableDto;
        auditableBody.createId = userId;
        auditableBody.updateId = userId; // Ao criar, quem criou é também quem alterou inicialmente
      }
    }
    // Se o método da requisição for PATCH/PUT (atualização)
    else if (request.method === 'PATCH' || request.method === 'PUT') {
      if (request.body && typeof request.body === 'object' && isAuditableRequest(request.body)) {
        const auditableBody = request.body as AuditableDto;
        auditableBody.updateId = userId;
        // quemCriouId não é alterado em updates, então não precisa ser setado
      }
    }

    // Continua para o próximo handler
    return next.handle();
  }
}