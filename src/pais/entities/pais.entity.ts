// src/pais/entities/pais.entity.ts
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Endereco } from '../../enderecos/entities/endereco.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('paises')
export class Pais extends BaseEntityAuditoria {
  @Column({ unique: true })
  descricao: string;

  @OneToMany(() => Endereco, endereco => endereco.pais)
  enderecos: Endereco[];

  @Column({ nullable: true })
  idEmpresa: string;

  @ManyToOne(() => Empresa, empresa => empresa.paises, { onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;
}