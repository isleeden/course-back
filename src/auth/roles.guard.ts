import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { getHeaders } from 'src/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const requiredRole = this.reflector.get(ROLES_KEY, context.getHandler());
      if (!requiredRole && requiredRole !== "") return true;
      const token = getHeaders(req);
      const user = this.jwtService.verify(token);
      if (user.blocked) throw new ForbiddenException();
      req.user = user
      return user.role == requiredRole;
    } catch (e) {
      throw new ForbiddenException();
    }
  }
}
