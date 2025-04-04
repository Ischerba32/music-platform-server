import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Sha256 from './sha256';

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

  async verifyToken(accessToken) {
    return this.jwtService.verify(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  hash(string) {
    return Sha256.hash(string);
  }
}
