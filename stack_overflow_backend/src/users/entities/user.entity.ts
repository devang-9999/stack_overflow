/* eslint-disable prettier/prettier */
import { Question } from "src/questions/entities/question.entity";
import { Entity, PrimaryGeneratedColumn, Column,
   CreateDateColumn, UpdateDateColumn, 
   OneToMany} from "typeorm";

@Entity("Users")
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  provider: string;

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @CreateDateColumn()
  createdAt:Date;

  @UpdateDateColumn()
  updatedAt:Date;

  @Column({ default: 'false' })
  isBanned: boolean;
  
//  @OneToMany(() => Vote, (vote) => vote.user)
//  votes: Vote[];

}