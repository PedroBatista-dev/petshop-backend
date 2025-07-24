import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCargos1753377955038 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cargos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "descricao" character varying NOT NULL, "canBeDeleted" boolean NOT NULL DEFAULT true, "idEmpresa" uuid, CONSTRAINT "UQ_dcb9c94583b7c2f38fe746c8635" UNIQUE ("descricao"), CONSTRAINT "PK_052f813788106484e4ef7cd1745" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cargos"`);
  }
}
