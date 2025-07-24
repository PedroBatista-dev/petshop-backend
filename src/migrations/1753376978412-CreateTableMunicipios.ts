import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMunicipios1753376978412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "municipios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "descricao" character varying NOT NULL, "estado" character varying NOT NULL, "codigoIbge" character varying, "idEmpresa" uuid, CONSTRAINT "UQ_287c23099e3bad949546de9b8c9" UNIQUE ("descricao"), CONSTRAINT "UQ_0941b47567a5fb9f318fe60a8a7" UNIQUE ("codigoIbge"), CONSTRAINT "PK_10d04b4b4e39ba40240b61e919d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "municipios"`);
  }
}
