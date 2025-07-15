import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export abstract class BaseEntityAuditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'create_id', nullable: true })
  createId: string;

  @CreateDateColumn({ name: 'create_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'update_id', nullable: true })
  updateId: string;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  setCreatedDate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedDate() {
    this.updatedAt = new Date();
  }
}
