import { CreateCommentDto } from './dto/create-comment-dto';
import { Comment } from 'src/comment/comment.schema';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginationData } from 'src/types/get-data.dto';
import { aggregateByLength } from 'src/utils';
import { CommentDocument } from './comment.schema';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private comment: Model<CommentDocument>,
    @Inject(forwardRef(() => ItemService))
    private itemService: ItemService,
  ) {}

  async findComments(query: getPaginationData) {
    const { results, count } = await aggregateByLength<Comment>(this.comment, {
      query,
      lengthField: '$likes',
    });
    const result = await results
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind({ path: '$user', preserveNullAndEmptyArrays: true });
    return { results: result, count };
  }

  async createComment(commentDto: CreateCommentDto, request) {
    const user = request.user.id;
    const createdComment = await this.comment.create({
      item: commentDto.item_id,
      text: commentDto.text,
      user,
    });
    this.itemService.addComment(commentDto.item_id, createdComment);
    return createdComment;
  }

  async remove(id: string, request) {
    return await this.comment.findByIdAndDelete(id);
  }

  async deleteMany(where: object) {
    return await this.comment.deleteMany(where);
  }
}
