// src/common/services/email.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    this.logger.log(`
      --- SIMULANDO ENVIO DE E-MAIL ---
      Para: ${to}
      Assunto: Redefinição de Senha - Sistema Petshop/Veterinária
      Corpo: Clique no link para redefinir sua senha: ${resetLink}
      ----------------------------------
      (Em produção, integre com um serviço de e-mail real como SendGrid, Mailgun, AWS SES ou Nodemailer com SMTP.)
    `);

    return Promise.resolve();
  }

  sendCreateEmpresaEmail(
    to: string,
    adminEmail: string,
    adminPassword: string,
  ): Promise<void> {
    this.logger.log(`
     --- SIMULANDO ENVIO DE E-MAIL ---
      Para: ${to}
      Assunto: Cadastro de Empresa - Sistema Petshop/Veterinária
      Corpo: 
        Parabéns por sua empresa ${to} entrar para o time Pet!
        
        Seu sistema já está pronto para uso.
        
        **Credenciais do Usuário Administrativo:**
        Login: ${adminEmail}
        Senha: ${adminPassword}
        
        Recomendamos que você faça login e altere esta senha o mais rápido possível.
        
        Acesse o sistema em: [Link para o seu frontend de login]
        
        Atenciosamente,
        Equipe PetConnect
      ----------------------------------
      (Em produção, integre com um serviço de e-mail real como SendGrid, Mailgun, AWS SES ou Nodemailer com SMTP.)
    `);

    return Promise.resolve();
  }
}
