import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongoose';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UsersService } from '../users/users.service';

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

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
