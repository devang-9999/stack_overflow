import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769770335066 implements MigrationInterface {
    name = 'Migration1769770335066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Answers" ("id" SERIAL NOT NULL, "answer" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "isValid" boolean NOT NULL DEFAULT false, "upVote" integer NOT NULL DEFAULT '0', "downVote" integer NOT NULL DEFAULT '0', "questionId" integer, CONSTRAINT "PK_e9ce77a9a6326d042fc833d63f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Vote" ("id" SERIAL NOT NULL, "status" boolean NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_856263ae97ea49bc3a1c9df11d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Answers" ADD CONSTRAINT "FK_ff66967b8c32d6a22e32e5c4f66" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Answers" DROP CONSTRAINT "FK_ff66967b8c32d6a22e32e5c4f66"`);
        await queryRunner.query(`DROP TABLE "Vote"`);
        await queryRunner.query(`DROP TABLE "Answers"`);
    }

}
