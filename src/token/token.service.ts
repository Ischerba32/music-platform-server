import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(user) {
    const data = { user };
    return this.jwtService.sign(data, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('EXPIRES_IN'),
    });
  }
}
