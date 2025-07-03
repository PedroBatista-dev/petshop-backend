// src/cargo/entities/cargo.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntityAuditoria } from '../../common/entities/base-entity-auditoria.entity'; 
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('cargos')
export class Cargo extends BaseEntityAuditoria { // Herda da classe base
  @Column({ unique: true })
  descricao: string; // Descricao (obrigatorio) - Ex: 'Dono_Master', 'Dono_Empresa', 'Gerente', 'Funcionario', 'Cliente'

  @OneToMany(() => Usuario, usuario => usuario.cargo)
  usuarios: Usuario[];
}