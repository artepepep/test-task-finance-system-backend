import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshHashColumnUsersTable1768831537864 implements MigrationInterface {
    name = 'AddRefreshHashColumnUsersTable1768831537864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshTokenHash" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshTokenHash"`);
    }

}
