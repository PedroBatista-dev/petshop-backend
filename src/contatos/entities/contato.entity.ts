import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity';

export enum Principal {
  SIM = 'S',
  NAO = 'N'
}

@Entity('contatos')
export class Contato extends BaseEntityAuditoria {
  @Column({ type: 'enum', enum: Principal })
  principal: Principal;

  @Column()
  nome: string;

  @Column()
  telefone: string;

  @Column()
  email: string; 

  @Column({ nullable: true })
  idEmpresa: string; 

  @ManyToOne(() => Empresa, empresa => empresa.contatos, { onDelete: 'CASCADE', nullable: true }) 
  @JoinColumn({ name: 'idEmpresa' })
  empresa: Empresa;

  @Column({ nullable: true })
  idUsuario: string;

  @ManyToOne(() => Usuario, usuario => usuario.contatos, { onDelete: 'CASCADE', nullable: true }) 
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;
}