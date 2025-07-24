import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnums1752583867658 implements MigrationInterface {
  name = 'CreateEnums1752583867658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."contatos_principal_enum" AS ENUM('S', 'N')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."enderecos_principal_enum" AS ENUM('S', 'N')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."enderecos_tipo_enum" AS ENUM('Residencial', 'Comercial')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_sexo_enum" AS ENUM('M', 'F', 'O')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_estadocivil_enum" AS ENUM('Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE "public"."usuarios_estadocivil_enum"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_sexo_enum"`);
    await queryRunner.query(`DROP TYPE "public"."enderecos_tipo_enum"`);
    await queryRunner.query(`DROP TYPE "public"."enderecos_principal_enum"`);
    await queryRunner.query(`DROP TYPE "public"."contatos_principal_enum"`);
  }
}
