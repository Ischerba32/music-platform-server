import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    return this.matchRoles(roles, req.user.role);
  }

  matchRoles(requiredRoles: string[], userRole: string) {
    const isMatched = requiredRoles.includes(userRole);
    if (!isMatched) throw new UnauthorizedException();
    return isMatched;
  }
}
