/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770052329700 implements MigrationInterface {
    name = 'Migration1770052329700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Answers" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Answers" DROP COLUMN "isDeleted"`);
    }

}
