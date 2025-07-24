import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableEnderecos1753378255373 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_IdPais" FOREIGN KEY ("idPais") REFERENCES "paises"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_IdMunicipio" FOREIGN KEY ("idMunicipio") REFERENCES "municipios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_IdEmpresa" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" ADD CONSTRAINT "FK_IdUsuario" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_IdPais"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_IdMunicipio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_IdEmpresa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enderecos" DROP CONSTRAINT "FK_IdUsuario"`,
    );
  }
}
