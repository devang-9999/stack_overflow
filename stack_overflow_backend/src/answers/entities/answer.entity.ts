/* eslint-disable prettier/prettier */
import { Question } from 'src/questions/entities/question.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';


@Entity('Answers')
export class Answers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column()
  userId: number;

  @Column({ default: false })
  isValid: boolean;

  // @Column({ default: 0 })
  // upVote: number;

  // @Column({ default: 0 })
  // downVote: number;

  @OneToMany(() => Vote, (vote) => vote.answer)
  votes: Vote[];

@ManyToOne(() => Answers, (a) => a.replies, {
  nullable: true,
  onDelete: 'CASCADE',
})
parentAnswer: Answers | null;

@OneToMany(() => Answers, (a) => a.parentAnswer)
replies: Answers[];

@Column({ default: false })
isDeleted: boolean;



}