// src/pais/entities/pais.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Enderecos } from '../../enderecos/entities/enderecos.entity';

@Entity('paises')
export class Pais extends BaseEntityAuditoria { // Herda da classe base
  @Column({ unique: true })
  descricao: string; // Descricao (obrigatorio)

  @OneToMany(() => Enderecos, endereco => endereco.pais)
  enderecos: Enderecos[];
}