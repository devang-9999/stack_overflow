/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class Login {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  email: string;

  @IsString({ message: 'user must be a string' })
  @IsNotEmpty({ message: 'user cannot be empty' })
  password: string;
}