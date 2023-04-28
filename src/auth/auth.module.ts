import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { LocalStrategy } from './localStrategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/users.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptService } from './bcrypt.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, BcryptService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
