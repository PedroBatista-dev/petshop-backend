// src/common/entities/base-entity-auditoria.entity.ts
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

// Este é um modelo abstrato que será estendido por outras entidades.
// Ele não será uma tabela separada no banco de dados.
export abstract class BaseEntityAuditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'create_id', nullable: true }) // Quem criou - ID do usuário
  createId: string;

  @CreateDateColumn({ name: 'create_at', type: 'timestamp' }) // Quando foi criado
  createdAt: Date;

  @Column({ name: 'update_id', nullable: true }) // Quem alterou - ID do usuário
  updateId: string;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' }) // Quando foi alterado
  updatedAt: Date;

  // Hooks do TypeORM para preencher automaticamente os campos de auditoria
  // A lógica de "quem" será preenchida por um interceptor ou um service,
  // pois não teremos acesso ao usuário autenticado diretamente na entidade.
  @BeforeInsert()
  setCreatedDate() {
    this.createdAt = new Date();
    this.updatedAt = new Date(); // Inicialmente, a data de criação e alteração são as mesmas
  }

  @BeforeUpdate()
  setUpdatedDate() {
    this.updatedAt = new Date();
  }
}