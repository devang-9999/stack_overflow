/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUp } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
 constructor(private readonly usersService: UsersService) {}

@Post()
  createUser(@Body() createUserDto: SignUp) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getAllUsers(){
    return this.usersService.getAllusers();
  }

  @Get(":id")
  getById(@Param("id") id:number){
    return this.usersService.getById(id);
  }

  
  @Patch(":id")
  updateById(@Param("id") id:number , @Body() updateUserDto:UpdateUserDto){
    return this.usersService.updateById(id , updateUserDto)
  }

  @Delete(":id")
  removeById(@Param("id") id:number){
    return this.usersService.removeById(id)
  }
}
