import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ObjectId } from 'mongoose';
// import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ?????
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.usersService.getOne(id);
  }
  // @Get(':username')
  // async findByUsername(
  //   @Param('username') username: string,
  // ): Promise<User | undefined> {
  //   return this.usersService.findByUsername(username);
  // }

  // @Get(':id')
  // async findById(@Param('id') id: string): Promise<User | undefined> {
  //   return this.usersService.findById(Number(id));
  // }
}
