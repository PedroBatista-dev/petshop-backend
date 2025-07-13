// src/municipio/entities/municipio.entity.ts
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Endereco } from '../../enderecos/entities/endereco.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('municipios')
export class Municipio extends BaseEntityAuditoria { // Herda da classe base
  @Column({ unique: true })
  descricao: string; // Descricao (obrigatorio)

  @Column()
  estado: string; // Estado (obrigatorio)

  @Column({ unique: true, nullable: true })
  codigoIbge: string; // CodigoIBGE (pode ser nullable se nem todo município tiver)

  @OneToMany(() => Endereco, endereco => endereco.municipio)
  enderecos: Endereco[];

  @Column({ nullable: true })
  idEmpresa: string;

  @ManyToOne(() => Empresa, empresa => empresa.municipios, { onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;
}