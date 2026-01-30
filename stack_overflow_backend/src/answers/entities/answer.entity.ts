/* eslint-disable prettier/prettier */
import { Question } from 'src/questions/entities/question.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  userId: number;

  @Column({ default: false })
  isValid: boolean;

  @Column({ default: 0 })
  upVote: number;

  @Column({ default: 0 })
  downVote: number;
}