import { PartialType } from '@nestjs/mapped-types';
import { SignUp } from './signup.dto';

export class UpdateUserDto extends PartialType(SignUp) {}
