import { IsInt, IsIn } from 'class-validator';

export class CreateVoteDto {
  @IsInt()
  answerId: number;

  @IsInt()
  userId: number;

  @IsIn([1, -1])
  value: number;
}
