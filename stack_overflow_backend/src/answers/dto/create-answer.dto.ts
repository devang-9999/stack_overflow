/* eslint-disable prettier/prettier */
import { IsString, IsInt } from 'class-validator';
import { Column } from 'typeorm';

export class CreateAnswerDto {
  @IsString()
  text: string;

  @Column()
  answer: string;

  @IsInt()
  userId: number;

  @IsInt()
  questionId: number;

}
