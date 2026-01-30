/* eslint-disable prettier/prettier */
import { Question } from 'src/questions/entities/question.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
} from 'typeorm';

@Entity('Tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Question, (question) => question.tags)
    questions: Question[];

    @CreateDateColumn()
    createdAt: Date;
}
