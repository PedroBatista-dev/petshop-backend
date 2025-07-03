// src/common/services/email.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    this.logger.log(`
      --- SIMULANDO ENVIO DE E-MAIL ---
      Para: ${to}
      Assunto: Redefinição de Senha - Sistema Petshop/Veterinária
      Corpo: Clique no link para redefinir sua senha: ${resetLink}
      ----------------------------------
      (Em produção, integre com um serviço de e-mail real como SendGrid, Mailgun, AWS SES ou Nodemailer com SMTP.)
    `);
  }
}