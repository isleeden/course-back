import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getHeaders } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { CommentService } from './comment.service';

@Injectable()
export class CommentGuard implements CanActivate {
  constructor(
    private commentService: CommentService,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = getHeaders(req);
      const user = this.jwtService.verify(token);
      return this.commentService.verify(user.id, req.params.id);
    } catch (e) {
      throw new ForbiddenException();
    }
  }
}
