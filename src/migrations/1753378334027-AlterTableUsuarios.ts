import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUsuarios1753378334027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD CONSTRAINT "FK_IdCargo" FOREIGN KEY ("idCargo") REFERENCES "cargos"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD CONSTRAINT "FK_IdEmpresa" FOREIGN KEY ("idEmpresa") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP CONSTRAINT "FK_IdCargo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP CONSTRAINT "FK_IdEmpresa"`,
    );
  }
}
