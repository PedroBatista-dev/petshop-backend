import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class InsertCargos1753378442716 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminId = uuidv4();
    const clienteId = uuidv4();

    await queryRunner.query(`
            INSERT INTO "cargos" ("id", "descricao", "canBeDeleted", "create_at", "update_at")
            VALUES ('${adminId}', 'Admin', FALSE, NOW(), NOW())
        `);

    await queryRunner.query(`
            INSERT INTO "cargos" ("id", "descricao", "canBeDeleted", "create_at", "update_at")
            VALUES ('${clienteId}', 'Cliente', FALSE, NOW(), NOW())
        `);
  }

  public async down(): Promise<void> {}
}
