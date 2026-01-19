import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalanceColumnAcountsTable1768833039644 implements MigrationInterface {
    name = 'AddBalanceColumnAcountsTable1768833039644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "balance" numeric(18,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "balance"`);
    }
}
