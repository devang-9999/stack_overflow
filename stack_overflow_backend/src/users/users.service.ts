/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUp } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) { }

 createUser(createUserDto: SignUp) {
    const SignUpUser = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(SignUpUser)
  }

    getAllusers() {
    return this.usersRepository.find();}


async getById(id: number) {
    const User =  await this.usersRepository.findOneBy({id : id});  
    if (!User) {
      throw new NotFoundException("User not found");
    }
    return User
  }

async updateById(id:number , updateUserDto: UpdateUserDto){
    const User = await this.usersRepository.preload({
      id:id, 
      ...updateUserDto
    })
    if(!User){
      throw new NotFoundException("User not found")
    }
    return this.usersRepository.save(User);
  }

  async removeById(id:number){
    const User =  await this.usersRepository.findOne({
      where:{id:id}
    });
     
    if(!User){
      throw new NotFoundException("User not found")
    }
    return await this.usersRepository.remove(User)
  }

}
