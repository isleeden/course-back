import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getHeaders } from 'src/utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = getHeaders(req);
      const user = this.jwtService.verify(token);
      if (user.blocked) throw new ForbiddenException();
      req.user = user
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
