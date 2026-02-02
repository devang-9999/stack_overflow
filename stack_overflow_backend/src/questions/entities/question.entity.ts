/* eslint-disable prettier/prettier */
import { Answers } from "src/answers/entities/answer.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { Users } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";

@Entity("Questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: "published"
  })
  status: "draft" | "published";

  @ManyToOne(() => Users, (user) => user.questions, {
    cascade: ['insert'],
    onDelete: "CASCADE"
  })
  user: Users;

  @ManyToMany(() => Tag, (tag) => tag.questions, {
    cascade: ['insert'],
  })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Answers, (answers) => answers.question)
  answers: Answers[];
}

