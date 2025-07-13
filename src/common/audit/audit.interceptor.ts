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
    const id = request.user ? (request.user as any).id : null; 

    const isAuditableRequest = (body: any): body is AuditableDto => {
      return typeof body === 'object' && body !== null && ('createId' in body || 'updateId' in body);
    };

    if (request.method === 'POST') {
      if (request.body && typeof request.body === 'object' && isAuditableRequest(request.body)) {
        const auditableBody = request.body as AuditableDto;
        auditableBody.createId = id;
        auditableBody.updateId = id; 
      }
    }
    
    else if (request.method === 'PATCH' || request.method === 'PUT') {
      if (request.body && typeof request.body === 'object' && isAuditableRequest(request.body)) {
        const auditableBody = request.body as AuditableDto;
        auditableBody.updateId = id;
      }
    }

    return next.handle();
  }
}