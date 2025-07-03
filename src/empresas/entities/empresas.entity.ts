// src/empresas/entities/empresas.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Contatos } from '../../contatos/entities/contatos.entity';
import { Enderecos } from '../../enderecos/entities/enderecos.entity';

@Entity('empresas')
export class Empresas extends BaseEntityAuditoria { // Herda da classe base
  @Column({ unique: true })
  razaoSocial: string; // RazaoSocial (obrigatorio)

  @Column()
  descricaoEmpresa: string; // DescricaoEmpresa (obrigatorio)

  @Column({ unique: true })
  cnpj: string; // CNPJ (obrigatorio)

  @Column()
  email: string; // Email (obrigatorio)

  @Column()
  telefone: string; // Telefone (obrigatorio)

  @Column({ unique: true })
  sigla: string; // Sigla (obrigatorio)

  @Column({ nullable: true })
  inscricaoMunicipal: string; // InscricaoMunicipal

  @Column({ nullable: true })
  inscricaoEstadual: string; // InscricaoEstadual

  @Column({ nullable: true })
  foto: string; // Foto (logo da empresa) - armazena o caminho ou URL da imagem

  @Column({ nullable: true })
  observacao: string; // Observacao

  @OneToMany(() => Usuario, usuario => usuario.empresa)
  usuarios: Usuario[];

  @OneToMany(() => Contatos, contato => contato.empresa)
  contatos: Contatos[];

  @OneToMany(() => Enderecos, endereco => endereco.empresa)
  enderecos: Enderecos[];
}