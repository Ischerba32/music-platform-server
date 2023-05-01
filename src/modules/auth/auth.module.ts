import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/users.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UsersService } from '../users/users.service';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from './jwtStrategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    BcryptModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokenModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    BcryptService,
    UsersService,
    ConfigService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
