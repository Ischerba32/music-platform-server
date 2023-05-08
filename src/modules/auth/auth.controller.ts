import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Headers,
  UnauthorizedException,
  Res,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { Roles } from 'src/config/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles-guard';
import { UserRole } from '../users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('signIn')
  async signIn(
    @Body() dto: SignInDto,
    @Response({ passthrough: true }) response,
  ) {
    return this.authService.signIn(dto, response);
  }

  @Get('check-auth')
  async checkAuthorization(@Headers('authorization') headers) {
    const payload = await this.authService.isAuthorized(headers);
    if (!Object.keys(payload).length) throw new UnauthorizedException();
    return payload;
  }
}
