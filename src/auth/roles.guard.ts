import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { getHeaders } from 'src/utils';
import Roles from 'src/types/roles';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
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
      return user.role == Roles.Admin;
    } catch (e) {
      throw new ForbiddenException();
    }
  }
}
