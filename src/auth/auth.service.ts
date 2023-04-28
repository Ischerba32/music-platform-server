import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongoose';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async validateUser(userId: ObjectId, password: string): Promise<any> {
    const user = await this.usersService.getOne(userId);
    if (user && (await this.bcryptService.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signUp(dto: CreateUserDto): Promise<CreateUserDto> {
    const existingUser = await this.usersService.getUserByEmail(dto.email);
    if (existingUser) {
      throw new HttpException('User with this email is already exist', 400);
    }
    return this.usersService.createUser(dto);
  }

  async signIn(dto: SignInDto): Promise<User> {
    const existingUser = await this.usersService.getUserByEmail(dto.email);
    if (!existingUser) {
      throw new HttpException('User is not exist', 400);
    }
    const isValidatedPassword = await this.bcryptService.compare(
      dto.password,
      existingUser.password,
    );

    if (!isValidatedPassword) throw new HttpException('Bad password', 400);

    return existingUser;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
