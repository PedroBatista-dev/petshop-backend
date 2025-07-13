// src/empresas/entities/empresas.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Contato } from '../../contatos/entities/contato.entity';
import { Endereco } from '../../enderecos/entities/endereco.entity';
import { Pais } from '../../pais/entities/pais.entity';
import { Municipio } from '../../municipios/entities/municipio.entity';
import { Cargo } from '../../cargos/entities/cargo.entity';

@Entity('empresas')
export class Empresa extends BaseEntityAuditoria { 
  @Column({ unique: true })
  razaoSocial: string; 

  @Column()
  descricaoEmpresa: string; 

  @Column({ unique: true })
  cnpj: string; 

  @Column()
  email: string; 

  @Column()
  telefone: string; 

  @Column({ unique: true, nullable: true })
  sigla: string; 

  @Column({ nullable: true })
  inscricaoMunicipal: string; 

  @Column({ nullable: true })
  inscricaoEstadual: string; 

  @Column({ nullable: true })
  foto: string; 

  @Column({ nullable: true })
  observacao: string;

  @OneToMany(() => Usuario, usuario => usuario.empresa)
  usuarios: Usuario[];

  @OneToMany(() => Contato, contato => contato.empresa)
  contatos: Contato[];

  @OneToMany(() => Endereco, endereco => endereco.empresa)
  enderecos: Endereco[];

  @OneToMany(() => Pais, usuario => usuario.empresa)
  paises: Pais[];

  @OneToMany(() => Municipio, usuario => usuario.empresa)
  municipios: Municipio[];

  @OneToMany(() => Cargo, usuario => usuario.empresa)
  cargos: Cargo[];
}