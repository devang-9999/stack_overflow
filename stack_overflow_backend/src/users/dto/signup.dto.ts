/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUp {

  @IsEmail()
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  readonly email: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  readonly password: string;


  @IsOptional()
  @IsString()
  provider:string;

}