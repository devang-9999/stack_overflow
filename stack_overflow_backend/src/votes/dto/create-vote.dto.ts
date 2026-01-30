/* eslint-disable prettier/prettier */
import { IsBoolean, IsInt } from "class-validator";

export class CreateVoteDto {

    @IsInt()
    answerId:number;
    
    @IsInt()
    userId:number;

    @IsBoolean()
    status:boolean;
}
