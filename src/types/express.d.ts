declare namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        descricaoCargo: string;
        idEmpresa: string;
      };
    }
  }