// src/contatos/entities/contatos.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empresas } from '../../empresas/entities/empresas.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; // Importe

export enum Principal {
  SIM = 'S',
  NAO = 'N'
}

@Entity('contatos')
export class Contatos extends BaseEntityAuditoria { // Herda da classe base
  @Column({ type: 'enum', enum: Principal })
  principal: Principal; // Principal (obrigatório, S ou N)

  @Column()
  nome: string; // Nome (obrigatório)

  @Column()
  telefone: string; // Telefone (obrigatório)

  @Column()
  email: string; // Email (obrigatório)

  @Column({ nullable: true })
  codigoEmpresaId: string; // CodigoEmpresa

  @ManyToOne(() => Empresas, empresa => empresa.contatos, { onDelete: 'CASCADE', nullable: true }) // Se a empresa for deletada, seus contatos são deletados
  @JoinColumn({ name: 'codigoEmpresaId' })
  empresa: Empresas;

  @Column({ nullable: true })
  codigoUsuarioId: string; // CodigoUsuario

  @ManyToOne(() => Usuario, usuario => usuario.contatos, { onDelete: 'CASCADE', nullable: true }) // Se o usuário for deletado, seus contatos são deletados
  @JoinColumn({ name: 'codigoUsuarioId' })
  usuario: Usuario;
}