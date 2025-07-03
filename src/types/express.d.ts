// src/express.d.ts
// Este arquivo estende a interface Request do Express para incluir a propriedade 'user'.
// Ele é lido automaticamente pelo TypeScript.

declare namespace Express {
    interface Request {
      // A tipagem de 'user' deve corresponder ao que seu JwtStrategy retorna em seu método 'validate'.
      // Com base na sua implementação anterior, o 'validate' do JwtStrategy retorna um objeto com:
      // { userId: string; email: string; cargoDescricao: string; codigoEmpresaId?: string; }
      user?: {
        userId: string;
        email: string;
        cargoDescricao: string;
        codigoEmpresaId?: string;
      };
    }
  }