import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  getComments() {
    this.commentService.findComments();
  }
}
