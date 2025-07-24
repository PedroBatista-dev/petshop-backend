import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsuarios1753378006077 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "nomeCompleto" character varying NOT NULL, "cpf" character varying NOT NULL, "dataNascimento" date NOT NULL, "sexo" "public"."usuarios_sexo_enum" NOT NULL, "estadoCivil" "public"."usuarios_estadocivil_enum" NOT NULL, "telefone" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP, "idCargo" uuid, "idEmpresa" uuid, CONSTRAINT "UQ_ebebcaef8457dcff6e6d69f17b0" UNIQUE ("cpf"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuarios"`);
  }
}
