// src/municipio/entities/municipio.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Enderecos } from '../../enderecos/entities/enderecos.entity';

@Entity('municipios')
export class Municipio extends BaseEntityAuditoria { // Herda da classe base
  @Column({ unique: true })
  descricao: string; // Descricao (obrigatorio)

  @Column()
  estado: string; // Estado (obrigatorio)

  @Column({ unique: true, nullable: true })
  codigoIbge: string; // CodigoIBGE (pode ser nullable se nem todo município tiver)

  @OneToMany(() => Enderecos, endereco => endereco.municipio)
  enderecos: Enderecos[];
}