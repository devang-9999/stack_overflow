import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770048061446 implements MigrationInterface {
    name = 'Migration1770048061446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT 'false'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT false`);
    }

}
