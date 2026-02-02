/* eslint-disable prettier/prettier */
import { IsArray, IsString, ArrayMinSize, IsInt, IsIn, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsIn(["draft", "published"])
  status?: "draft" | "published";

}
