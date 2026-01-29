/* eslint-disable prettier/prettier */
// import { Question } from "src/questions/entities/question.entity";
import { Entity, PrimaryGeneratedColumn, Column, 
  // OneToMany,
   CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("Users")
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // @OneToMany(() => Question, (question) => question.users)
  // question: Question[];

  @CreateDateColumn()
  createdAt:Date;

  @UpdateDateColumn()
  updatedAt:Date;

}