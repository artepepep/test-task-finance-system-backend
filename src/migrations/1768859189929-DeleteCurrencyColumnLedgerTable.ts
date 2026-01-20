import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteCurrencyColumnLedgerTable1768859189929 implements MigrationInterface {
  name = 'DeleteCurrencyColumnLedgerTable1768859189929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ledger" DROP COLUMN "currency"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ledger" ADD "currency" character varying(3) NOT NULL`,
    );
  }
}
