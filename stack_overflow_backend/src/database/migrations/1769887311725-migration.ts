/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769887311725 implements MigrationInterface {
    name = 'Migration1769887311725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Answers" ("id" SERIAL NOT NULL, "answer" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "isValid" boolean NOT NULL DEFAULT false, "upVote" integer NOT NULL DEFAULT '0', "downVote" integer NOT NULL DEFAULT '0', "questionId" integer, CONSTRAINT "PK_e9ce77a9a6326d042fc833d63f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b1d1866e77403e234680dcb803" UNIQUE ("name"), CONSTRAINT "PK_61aa7408a426fea5dd8416f5a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Questions" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'published', "userId" integer, CONSTRAINT "PK_8f81bcc6305787ab7dd0d828e21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Vote" ("id" SERIAL NOT NULL, "status" boolean NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_856263ae97ea49bc3a1c9df11d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions_tags_tags" ("questionsId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_6c1ea3a815ea62263aaf7cfcd80" PRIMARY KEY ("questionsId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91353dfa02de18aeab04ef3a60" ON "questions_tags_tags" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ebfd7ef95ffa54c9997580c8d2" ON "questions_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "Answers" ADD CONSTRAINT "FK_ff66967b8c32d6a22e32e5c4f66" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Questions" ADD CONSTRAINT "FK_90df89573b3678e557cfe6fc7d5" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions_tags_tags" ADD CONSTRAINT "FK_91353dfa02de18aeab04ef3a60e" FOREIGN KEY ("questionsId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "questions_tags_tags" ADD CONSTRAINT "FK_ebfd7ef95ffa54c9997580c8d27" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions_tags_tags" DROP CONSTRAINT "FK_ebfd7ef95ffa54c9997580c8d27"`);
        await queryRunner.query(`ALTER TABLE "questions_tags_tags" DROP CONSTRAINT "FK_91353dfa02de18aeab04ef3a60e"`);
        await queryRunner.query(`ALTER TABLE "Questions" DROP CONSTRAINT "FK_90df89573b3678e557cfe6fc7d5"`);
        await queryRunner.query(`ALTER TABLE "Answers" DROP CONSTRAINT "FK_ff66967b8c32d6a22e32e5c4f66"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ebfd7ef95ffa54c9997580c8d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91353dfa02de18aeab04ef3a60"`);
        await queryRunner.query(`DROP TABLE "questions_tags_tags"`);
        await queryRunner.query(`DROP TABLE "Vote"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Questions"`);
        await queryRunner.query(`DROP TABLE "Tags"`);
        await queryRunner.query(`DROP TABLE "Answers"`);
    }

}
