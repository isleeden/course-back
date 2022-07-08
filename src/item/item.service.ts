import { CommentDocument } from './../comment/comment.schema';
import { CollectionDocument } from 'src/collection/collection.schema';
import { CommentService } from './../comment/comment.service';
import { CreateFieldValueDto } from '../field-value/dto/create-field-value.dto';
import { CreateItemDto } from './dto/create-item.dto';
import {
  Inject,
  Injectable,
  forwardRef,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagService } from 'src/tag/tag.service';
import { Item, ItemDocument } from './item.schema';
import { TagDocument } from '../tag/tag.schema';
import { CollectionService } from '../collection/collection.service';
import { FieldValueDocument } from '../field-value/field-value.schema';
import { getPaginationData } from 'src/types/get-data.dto';
import { paginationQuery } from 'src/utils';
import { FieldValueService } from 'src/field-value/field-value.service';
import { UserDocument } from 'src/users/users.schema';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private item: Model<ItemDocument>,
    private tagService: TagService,
    @Inject(forwardRef(() => FieldValueService))
    private fieldValueService: FieldValueService,
    @Inject(forwardRef(() => CollectionService))
    private collectionService: CollectionService,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async addItem(itemDto: CreateItemDto, request) {
    await this.collectionService.verify(request.user.id, itemDto.collection_id);
    const createdItem = await this.item.create({
      name: itemDto.name,
      _collection: itemDto.collection_id,
    });
    await this.bindFieldValues(itemDto.fieldValues, createdItem);
    await this.bindTags(itemDto.tags, createdItem);
    await this.collectionService.findAndAddItem(
      itemDto.collection_id,
      createdItem,
    );
    return await this.item.findById(createdItem._id);
  }

  async update(id: string, itemDto: CreateItemDto) {
    const item = await this.item.findById(id);
    this.unbindTags(item);
    const updatedItem = await this.item.findByIdAndUpdate(id, {
      name: itemDto.name,
      _collection: itemDto.collection_id,
      fields: [],
      tags: [],
    });
    await this.bindFieldValues(itemDto.fieldValues, updatedItem);
    await this.bindTags(itemDto.tags, updatedItem);
    return updatedItem;
  }

  async remove(id: string) {
    const item = await this.item.findById(id);
    this.unbindTags(item);
    const collection = item._collection as CollectionDocument;
    this.collectionService.unbindItem(item, collection._id);
    this.commentService.deleteMany({ item: id });
    this.fieldValueService.deleteMany({ item: id });
    return await item.delete();
  }

  async findById(id: string) {
    return await this.item.findById(id);
  }

  async addValue(itemId: string, fieldValue: FieldValueDocument) {
    return await this.item.findByIdAndUpdate(
      itemId,
      { $push: { fieldValues: fieldValue._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async addComment(itemId: string, comment: CommentDocument) {
    return await this.item.findByIdAndUpdate(
      itemId,
      { $push: { comments: comment._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async addTagToItem(tag: TagDocument, item: ItemDocument) {
    return await this.item.findByIdAndUpdate(
      item._id,
      { $push: { tags: tag._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async findItems(query: getPaginationData) {
    const { findQuery, count } = await paginationQuery<Item>(this.item, {
      query,
    });
    const results = await findQuery.populate('fieldValues').populate('tags');
    return { results, count };
  }

  async findItem(id: string) {
    return await this.item
      .findById(id)
      .populate('fieldValues')
      .populate('tags')
      .populate({
        path: '_collection',
        populate: [{ path: 'fields' }, { path: 'user' }],
      });
  }

  private async bindFieldValues(
    fieldValues: CreateFieldValueDto[],
    item: ItemDocument,
  ) {
    for (const value of fieldValues) {
      await this.fieldValueService.addField(value, item._id);
    }
  }

  private async bindTags(tags: string[], item: ItemDocument) {
    const uniqueTags = this.getUniqueTags(tags);
    for (const tag of uniqueTags) {
      const findedTag = await this.tagService.findOrCreate({ name: tag });
      await this.addTagToItem(findedTag, item);
      await this.tagService.addItemToTag(item, findedTag._id);
    }
  }

  private unbindTags(item: ItemDocument) {
    for (const tag of item.tags as TagDocument[]) {
      this.tagService.unbindItem(item, tag._id);
    }
  }

  private getUniqueTags(tags: string[]) {
    const uniqueTags = [];
    tags.forEach((element) => {
      if (!uniqueTags.includes(element)) {
        uniqueTags.push(element.trim());
      }
    });
    return uniqueTags;
  }

  async verify(user_id: string, item_id: string) {
    if (await this.authService.verifyUser(user_id)) return true;
    const item = await this.item.findById(item_id).populate({
      path: '_collection',
      populate: [{ path: 'fields' }, { path: 'user' }],
    });
    console.log(this.item.findById(item_id));
    const author = item._collection.user as UserDocument;
    if (author._id !== user_id) throw new ForbiddenException();
    return true;
  }
}
