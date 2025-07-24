import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableMunicipios1753378156492 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "municipios" ADD CONSTRAINT "FK_IdEmpresa" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "municipios" DROP CONSTRAINT "FK_IdEmpresa"`,
    );
  }
}
