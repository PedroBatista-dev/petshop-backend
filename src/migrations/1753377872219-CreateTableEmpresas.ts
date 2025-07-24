import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableEmpresas1753377872219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "empresas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "razaoSocial" character varying NOT NULL, "descricaoEmpresa" character varying NOT NULL, "cnpj" character varying NOT NULL, "email" character varying NOT NULL, "telefone" character varying NOT NULL, "sigla" character varying, "inscricaoMunicipal" character varying, "inscricaoEstadual" character varying, "foto" character varying, "observacao" character varying, CONSTRAINT "UQ_bca01e81336515f4cebb70bb67f" UNIQUE ("razaoSocial"), CONSTRAINT "UQ_f5ed71aeb4ef47f95df5f8830b8" UNIQUE ("cnpj"), CONSTRAINT "UQ_5ad46a63f7cf1d5c32f9ea7cc11" UNIQUE ("sigla"), CONSTRAINT "PK_ce7b122b37c6499bfd6520873e1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "empresas"`);
  }
}
