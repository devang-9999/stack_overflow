import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770036363918 implements MigrationInterface {
    name = 'Migration1770036363918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT false`);
    }

}
