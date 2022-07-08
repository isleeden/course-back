import { ItemService } from 'src/item/item.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getHeaders } from 'src/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ItemGuard implements CanActivate {
  constructor(
    private itemService: ItemService,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = getHeaders(req);
      const user = this.jwtService.verify(token);
      return this.itemService.verify(user.id, req.params.id);
    } catch (e) {
      throw new ForbiddenException();
    }
  }
}
