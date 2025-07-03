// src/usuario/entities/usuario.entity.ts
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Empresas } from '../../empresas/entities/empresas.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; // Importe
import * as bcrypt from 'bcrypt';
import { Contatos } from '../../contatos/entities/contatos.entity';
import { Enderecos } from '../../enderecos/entities/enderecos.entity';

export enum Sexo {
  MASCULINO = 'M',
  FEMININO = 'F',
  OUTRO = 'O'
}

export enum EstadoCivil {
  SOLTEIRO = 'Solteiro',
  CASADO = 'Casado',
  DIVORCIADO = 'Divorciado',
  VIUVO = 'Viúvo',
  UNIAO_ESTAVEL = 'União Estável'
}

@Entity('usuarios')
export class Usuario extends BaseEntityAuditoria { // Herda da classe base
  @Column()
  nomeCompleto: string; // NomeCompleto (obrigatório)

  @Column({ unique: true })
  cpf: string; // CPF (obrigatório)

  @Column({ type: 'date' })
  dataNascimento: Date; // DataNascimento (obrigatório)

  @Column({ type: 'enum', enum: Sexo })
  sexo: Sexo; // Sexo (obrigatório)

  @Column({ type: 'enum', enum: EstadoCivil })
  estadoCivil: EstadoCivil; // EstadoCivil (obrigatório)

  @Column()
  telefone: string; // Telefone (obrigatório)

  @Column({ unique: true })
  email: string; // Email (obrigatório)

  @Column()
  passwordHash: string; // Para armazenar a senha com hash

  @Column({ nullable: true })
  resetPasswordToken: string; // Token para recuperação de senha

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date; // Validade do token

  @Column({ nullable: true }) // CódigoCargo (obrigatório) - ID do cargo
  codigoCargoId: string;

  @ManyToOne(() => Cargo, cargo => cargo.usuarios, { onDelete: 'RESTRICT' }) // Não permite deletar cargo se houver usuário associado
  @JoinColumn({ name: 'codigoCargoId' })
  cargo: Cargo;

  @Column({ nullable: true }) // Vinculo com Empresa (pode ser nulo para DONO_MASTER ou CLIENTE avulso)
  codigoEmpresaId: string;

  @ManyToOne(() => Empresas, empresa => empresa.usuarios, { onDelete: 'SET NULL' }) // Se a empresa for deletada, o usuário fica sem empresa
  @JoinColumn({ name: 'codigoEmpresaId' })
  empresa: Empresas;

  @OneToMany(() => Contatos, contato => contato.usuario)
  contatos: Contatos[];

  @OneToMany(() => Enderecos, endereco => endereco.usuario)
  enderecos: Enderecos[];

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}