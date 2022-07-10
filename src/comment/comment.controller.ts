import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment-dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { getPaginationData } from 'src/types/get-data.dto';
import { CommentService } from './comment.service';
import { CommentGuard } from './comment.guard';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  getComments(@Query() query: getPaginationData) {
    return this.commentService.findComments(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createComment(@Body() commentDto: CreateCommentDto, @Req() request) {
    return this.commentService.createComment(commentDto, request);
  }

  @UseGuards(CommentGuard)
  @Delete('/:id')
  removeComment(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
