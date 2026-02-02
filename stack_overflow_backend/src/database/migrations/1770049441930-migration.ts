import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770049441930 implements MigrationInterface {
    name = 'Migration1770049441930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Questions" DROP CONSTRAINT "FK_90df89573b3678e557cfe6fc7d5"`);
        await queryRunner.query(`ALTER TABLE "Questions" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT 'false'`);
        await queryRunner.query(`ALTER TABLE "Questions" ADD CONSTRAINT "FK_90df89573b3678e557cfe6fc7d5" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Questions" DROP CONSTRAINT "FK_90df89573b3678e557cfe6fc7d5"`);
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "isBanned" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Questions" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Questions" ADD CONSTRAINT "FK_90df89573b3678e557cfe6fc7d5" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
