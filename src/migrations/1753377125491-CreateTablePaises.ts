import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePaises1753377125491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "paises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "descricao" character varying NOT NULL, "idEmpresa" uuid, CONSTRAINT "UQ_8997bc726c09a116d3c5787a160" UNIQUE ("descricao"), CONSTRAINT "PK_6b10c7997f3076c02e73c63b043" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "paises"`);
  }
}
