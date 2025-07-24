import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableContatos1753378088055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contatos" ADD CONSTRAINT "FK_IdEmpresa" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contatos" ADD CONSTRAINT "FK_IdUsuario" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contatos" DROP CONSTRAINT "FK_IdEmpresa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contatos" DROP CONSTRAINT "FK_IdUsuario"`,
    );
  }
}
