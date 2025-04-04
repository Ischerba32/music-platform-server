import { HttpException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/schemas/users.schema';
import { TokenService } from '../token/token.service';

type AuthResponse = User & {
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
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

  async signUp(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.getUserByEmail(dto.email);
    if (existingUser) {
      throw new HttpException('User with this email is already exist', 400);
    }
    return this.usersService.createUser(dto);
  }

  async signIn(dto: SignInDto, response): Promise<AuthResponse> {
    const existingUser = await this.usersService.getUserByEmail(dto.email);
    if (!existingUser) {
      throw new HttpException('User is not exist', 400);
    }
    const isValidatedPassword = await this.bcryptService.compare(
      dto.password,
      existingUser.password,
    );

    if (!isValidatedPassword) throw new HttpException('Bad password', 400);
    const payload = {
      username: existingUser.username,
      id: existingUser._id,
      role: existingUser.role,
    };
    const token = await this.tokenService.generateToken(payload);
    response.cookie('token', token, {
      expires: new Date(new Date().getTime() + 3600 * 1000),
      sameSite: 'strict',
      httpOnly: true,
    });
    return { ...existingUser, token };
  }

  async isAuthorized(authHeader: string): Promise<any> {
    if (!authHeader) return false;

    const accessToken = authHeader.split(' ')[1];
    try {
      const payload = await this.tokenService.verifyToken(accessToken);
      if (!payload.user.username || !payload.user.id || !payload.user.role) {
        return {};
      }
      const userFavs = (await this.usersService.getOne(payload.user.id))
        .favorites;
      return { ...payload, favorites: userFavs };
    } catch (error) {
      return {};
    }
  }
}
