/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769688288223 implements MigrationInterface {
    name = 'Migration1769688288223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_2f0d174f4b50799d153def4bb7c"`);
        await queryRunner.query(`CREATE TABLE "Questions" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "tag" character varying NOT NULL, "usersId" integer, CONSTRAINT "PK_8f81bcc6305787ab7dd0d828e21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "tag"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "usersId"`);
        await queryRunner.query(`ALTER TABLE "Questions" ADD CONSTRAINT "FK_840cbbef90ec78b1b8b3abacc58" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Questions" DROP CONSTRAINT "FK_840cbbef90ec78b1b8b3abacc58"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "usersId" integer`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "tag" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "Questions"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_2f0d174f4b50799d153def4bb7c" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
