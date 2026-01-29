/* eslint-disable prettier/prettier */
import { Users } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

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

  @ManyToOne(() => Users, {cascade : true})
  users: Users[];

  @Column()
  tag:string

}