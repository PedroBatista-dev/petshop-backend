import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class CreateTablesAuth1752583867658 implements MigrationInterface {
  name = 'CreateTablesAuth1752583867658';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. CRIAR TODOS OS TIPOS ENUM PRIMEIRO
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

    // 2. DEPOIS, CRIAR TODAS AS TABELAS
    await queryRunner.query(
      `CREATE TABLE "contatos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "principal" "public"."contatos_principal_enum" NOT NULL, "nome" character varying NOT NULL, "telefone" character varying NOT NULL, "email" character varying NOT NULL, "idEmpresa" uuid, "idUsuario" uuid, CONSTRAINT "PK_994cdcb2c56dfb5b66217c854cc" PRIMARY KEY ("id"))`,
    );

    // CORREÇÃO: Adicionada a coluna "idEmpresa" à tabela "municipios"
    await queryRunner.query(
      `CREATE TABLE "municipios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "descricao" character varying NOT NULL, "estado" character varying NOT NULL, "codigoIbge" character varying, "idEmpresa" uuid, CONSTRAINT "UQ_287c23099e3bad949546de9b8c9" UNIQUE ("descricao"), CONSTRAINT "UQ_0941b47567a5fb9f318fe60a8a7" UNIQUE ("codigoIbge"), CONSTRAINT "PK_10d04b4b4e39ba40240b61e919d" PRIMARY KEY ("id"))`,
    );

    // CORREÇÃO: Adicionada a coluna "idEmpresa" à tabela "paises"
    await queryRunner.query(
      `CREATE TABLE "paises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "descricao" character varying NOT NULL, "idEmpresa" uuid, CONSTRAINT "UQ_8997bc726c09a116d3c5787a160" UNIQUE ("descricao"), CONSTRAINT "PK_6b10c7997f3076c02e73c63b043" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "enderecos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "principal" "public"."enderecos_principal_enum" NOT NULL, "tipo" "public"."enderecos_tipo_enum" NOT NULL, "cep" character varying NOT NULL, "logradouro" character varying NOT NULL, "numero" character varying NOT NULL, "complemento" character varying, "bairro" character varying NOT NULL, "idPais" uuid NOT NULL, "idMunicipio" uuid NOT NULL, "idEmpresa" uuid, "idUsuario" uuid, CONSTRAINT "PK_208b05002dcdf7bfbad378dcac1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "empresas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "razaoSocial" character varying NOT NULL, "descricaoEmpresa" character varying NOT NULL, "cnpj" character varying NOT NULL, "email" character varying NOT NULL, "telefone" character varying NOT NULL, "sigla" character varying, "inscricaoMunicipal" character varying, "inscricaoEstadual" character varying, "foto" character varying, "observacao" character varying, CONSTRAINT "UQ_bca01e81336515f4cebb70bb67f" UNIQUE ("razaoSocial"), CONSTRAINT "UQ_f5ed71aeb4ef47f95df5f8830b8" UNIQUE ("cnpj"), CONSTRAINT "UQ_5ad46a63f7cf1d5c32f9ea7cc11" UNIQUE ("sigla"), CONSTRAINT "PK_ce7b122b37c6499bfd6520873e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cargos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "descricao" character varying NOT NULL, "canBeDeleted" boolean NOT NULL DEFAULT true, "idEmpresa" uuid, CONSTRAINT "UQ_dcb9c94583b7c2f38fe746c8635" UNIQUE ("descricao"), CONSTRAINT "PK_052f813788106484e4ef7cd1745" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_id" character varying, "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_id" character varying, "update_at" TIMESTAMP NOT NULL DEFAULT now(), "nomeCompleto" character varying NOT NULL, "cpf" character varying NOT NULL, "dataNascimento" date NOT NULL, "sexo" "public"."usuarios_sexo_enum" NOT NULL, "estadoCivil" "public"."usuarios_estadocivil_enum" NOT NULL, "telefone" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP, "idCargo" uuid, "idEmpresa" uuid, CONSTRAINT "UQ_ebebcaef8457dcff6e6d69f17b0" UNIQUE ("cpf"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );

    // 3. DEPOIS, CRIAR AS CHAVES ESTRANGEIRAS
    await queryRunner.query(
      `ALTER TABLE "contatos" ADD CONSTRAINT "FK_2e0f6d0d57fa1cc027222108bc6" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contatos" ADD CONSTRAINT "FK_095e8749649d58fe5db73124d5b" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "municipios" ADD CONSTRAINT "FK_537c22796fef86fc01cca361db5" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "paises" ADD CONSTRAINT "FK_262fff1db33d141ef1038a8bde7" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_2bd85e2fe73e93d43a2df3681b4" FOREIGN KEY ("idPais") REFERENCES "paises"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_247a322506f1dc1841484a694ea" FOREIGN KEY ("idMunicipio") REFERENCES "municipios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_147a8f8488d35c1259f1b0ce1a0" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_e4c1283d32b30702d831636b5cb" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cargos" ADD CONSTRAINT "FK_3c673e7629a5d47af5cd4833f3f" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD CONSTRAINT "FK_4eaecd45840e9c4ecfb8519bc5e" FOREIGN KEY ("idCargo") REFERENCES "cargos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD CONSTRAINT "FK_54cabcc11c60730711f5bbb8127" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );

    // 4. POR FIM, INSERIR OS DADOS INICIAIS
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ... (sua função down pode permanecer como está)
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP CONSTRAINT "FK_3e2f00038c8cf462acbcf774b6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP CONSTRAINT "FK_f73296da306a1e18b8d9c96b68b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_669782fbb62f3fa87290046f39a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_72b762c790a9ac9b8f3b2dba801"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_71238b24667fc8b806b4bedcf10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_d9be28a4a1886fb93f5392c7c57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contatos" DROP CONSTRAINT "FK_2d58d87ae17d8baf13e1bfe349d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contatos" DROP CONSTRAINT "FK_78488283edbb7eee6a4f45412f8"`,
    );
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_estadocivil_enum"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_sexo_enum"`);
    await queryRunner.query(`DROP TABLE "cargos"`);
    await queryRunner.query(`DROP TABLE "empresas"`);
    await queryRunner.query(`DROP TABLE "enderecos"`);
    await queryRunner.query(`DROP TYPE "public"."enderecos_tipo_enum"`);
    await queryRunner.query(`DROP TYPE "public"."enderecos_principal_enum"`);
    await queryRunner.query(`DROP TABLE "paises"`);
    await queryRunner.query(`DROP TABLE "municipios"`);
    await queryRunner.query(`DROP TABLE "contatos"`);
    await queryRunner.query(`DROP TYPE "public"."contatos_principal_enum"`);
  }
}
