/* eslint-disable prettier/prettier */
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  text: string;

  @IsInt()
  userId: number;

  @IsInt()
  questionId: number;

  @IsOptional()
  @IsInt()
  parentAnswerId?: number;



}
