import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeColumnTransactionTable1768833433053 implements MigrationInterface {
    name = 'AddTypeColumnTransactionTable1768833433053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('transfer', 'exchange')`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "type" "public"."transactions_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
