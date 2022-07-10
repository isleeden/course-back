import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getHeaders } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { CollectionService } from './collection.service';

@Injectable()
export class CollectionGuard implements CanActivate {
  constructor(
    private collectionService: CollectionService,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = getHeaders(req);
      const user = this.jwtService.verify(token);
      return this.collectionService.verify(user.id, req.params.id);
    } catch (e) {
      throw new ForbiddenException();
    }
  }
}
