/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Answers } from 'src/answers/entities/answer.entity';

@Entity('Votes')
@Unique(['userId', 'answer'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  value: number;

  // @ManyToOne(() => Users, (user) => user.votes, { onDelete: 'CASCADE' })
  // user: Users;

  @ManyToOne(() => Answers, (answer) => answer.votes, { onDelete: 'CASCADE' })
  answer: Answers;

}
