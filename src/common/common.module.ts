// src/common/common.module.ts
import { Module, Global } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { AuditInterceptor } from './audit/audit.interceptor';

@Global() // Torna o EmailService e o AuditInterceptor disponíveis globalmente
@Module({
  providers: [
    EmailService,
    AuditInterceptor,
    // O AuditInterceptor é fornecido globalmente no AppModule, então não precisa aqui.
    // Mas se fosse um interceptor local, seria adicionado aqui.
  ],
  exports: [EmailService],
})
export class CommonModule {}