import { EstadoCivil, Sexo } from '../usuario/entities/usuario.entity';

export interface JwtUserPayload {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: Date;
  sexo: Sexo;
  estadoCivil: EstadoCivil;
  telefone: string;
  email: string;
  descricaoCargo: string;
  idEmpresa: string;
}
