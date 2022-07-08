import { UsersService } from 'src/users/users.service';
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
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = getHeaders(req);
      const userToken = this.jwtService.verify(token);
      const user = await this.usersService.findById(userToken.id);
      if (user.blocked || !user) throw new ForbiddenException();
      req.user = userToken;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
