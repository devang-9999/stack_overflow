/* eslint-disable prettier/prettier */
import { IsArray, IsString, ArrayMinSize, IsInt, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsInt()
  userId: number;
}
