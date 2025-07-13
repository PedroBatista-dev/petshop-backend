// src/cargo/entities/cargo.entity.ts
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('cargos')
export class Cargo extends BaseEntityAuditoria { 
  @Column({ unique: true })
  descricao: string;

  @Column({ type: 'boolean', default: true })
  canBeDeleted: boolean;

  @OneToMany(() => Usuario, usuario => usuario.cargo)
  usuarios: Usuario[];

  @Column({ nullable: true })
  idEmpresa: string;

  @ManyToOne(() => Empresa, empresa => empresa.cargos, { onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;
}