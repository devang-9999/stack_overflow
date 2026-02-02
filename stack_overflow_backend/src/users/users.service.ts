/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUp } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Login } from './dto/login.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) { }

  signUp(createUserDto: SignUp) {
    const SignUpUser = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(SignUpUser)
  }

  getAllusers() {
    return this.usersRepository.find();
  }


  async login(loginDto: Login) {
    const { email, password } = loginDto;
    const User = await this.usersRepository.findOne({
      where: {
        email: email,
        password: password,
        isBanned: false
      },
    });

    if (!User) {
      throw new HttpException({ message: 'Invalid credentials' }, 401);
    }

    return User;
  }


  async getById(id: number) {
    const User = await this.usersRepository.findOneBy({ id: id });
    if (!User) {
      throw new NotFoundException("User not found");
    }
    return User
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const User = await this.usersRepository.preload({
      id: id,
      email: updateUserDto.email,
      password: updateUserDto.password,
    })
    if (!User) {
      throw new NotFoundException("User not found")
    }
    return this.usersRepository.save(User);
  }

  async removeById(id: number) {
    const User = await this.usersRepository.findOne({
      where: { id: id }
    });

    if (!User) {
      throw new NotFoundException("User not found")
    }
    return await this.usersRepository.remove(User)
  }

    async banUser(id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.isBanned = true;
    return this.usersRepository.save(user);
  }

  async unbanUser(id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.isBanned = false;
    return this.usersRepository.save(user);
  }

}
