import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableEnderecos1753377793021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "enderecos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "principal" "public"."enderecos_principal_enum" NOT NULL, "tipo" "public"."enderecos_tipo_enum" NOT NULL, "cep" character varying NOT NULL, "logradouro" character varying NOT NULL, "numero" character varying NOT NULL, "complemento" character varying, "bairro" character varying NOT NULL, "idPais" uuid NOT NULL, "idMunicipio" uuid NOT NULL, "idEmpresa" uuid, "idUsuario" uuid, CONSTRAINT "PK_208b05002dcdf7bfbad378dcac1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "enderecos"`);
  }
}
