import { CreateCommentDto } from './dto/create-comment-dto';
import { Comment } from 'src/comment/comment.schema';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginationData } from 'src/types/get-data.dto';
import { aggregateByLength, paginationQuery } from 'src/utils';
import { CommentDocument } from './comment.schema';
import { ItemService } from 'src/item/item.service';
import { AuthService } from 'src/auth/auth.service';
import { UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private comment: Model<CommentDocument>,
    @Inject(forwardRef(() => ItemService))
    private itemService: ItemService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async findComments(query: getPaginationData) {
    const { findQuery, count } = await paginationQuery<Comment>(this.comment, {
      query,
    });
    const results = await findQuery.populate('user');
    return { results, count };
  }

  async createComment(commentDto: CreateCommentDto, request) {
    const user = request.user.id;
    const createdComment = await this.comment.create({
      item: commentDto.item_id,
      text: commentDto.text,
      user,
    });
    this.usersService.findAndAddComment(user, createdComment);
    this.itemService.addComment(commentDto.item_id, createdComment);
    return createdComment;
  }

  async remove(id: string) {
    return await this.comment.findByIdAndDelete(id);
  }

  async deleteMany(where: object) {
    return await this.comment.deleteMany(where);
  }

  async verify(user_id: string, comment_id: string) {
    if (await this.authService.verifyUser(user_id)) return true;
    const comment = await this.comment.findById(comment_id).populate('user');
    const author = comment.user as UserDocument;
    if (author._id.toString() !== user_id) throw new ForbiddenException();
    return true;
  }
}
