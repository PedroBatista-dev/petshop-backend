import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableCargos1753378296760 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cargos" ADD CONSTRAINT "FK_IdEmpresa" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cargos" DROP CONSTRAINT "FK_IdEmpresa"`,
    );
  }
}
