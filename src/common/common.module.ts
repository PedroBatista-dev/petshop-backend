// src/common/common.module.ts
import { Module, Global } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { AuditInterceptor } from './audit/audit.interceptor';

@Global() 
@Module({
  providers: [
    EmailService,
    AuditInterceptor,
  ],
  exports: [EmailService],
})
export class CommonModule {}