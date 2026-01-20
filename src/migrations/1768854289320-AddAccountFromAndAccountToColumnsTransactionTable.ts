import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountFromAndAccountToColumnsTransactionTable1768854289320 implements MigrationInterface {
    name = 'AddAccountFromAndAccountToColumnsTransactionTable1768854289320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "account_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "from_account_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "to_account_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_91ac87a22755563425b98ffc3c0" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_d81b9f7079880ed2c82d60a94b9" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_d81b9f7079880ed2c82d60a94b9"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_91ac87a22755563425b98ffc3c0"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "to_account_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "from_account_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "account_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_49c0d6e8ba4bfb5582000d851f0" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
