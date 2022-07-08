import { paginationQuery } from 'src/utils';
import { UserDocument } from './users.schema';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { getPaginationData } from 'src/types/get-data.dto';
import { paginationResult } from 'src/types/pagination-result';
import { hash, compare } from 'bcrypt';
import { CollectionDocument } from 'src/collection/collection.schema';
import { CollectionService } from 'src/collection/collection.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private user: Model<UserDocument>,
    @Inject(forwardRef(() => CollectionService))
    private collectionService: CollectionService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.user(userDto);
    return await createdUser.save();
  }

  async findByName(name: string) {
    return await this.user.findOne({ name }).exec();
  }

  async findById(id: string) {
    return await this.user.findById(id);
  }

  async updateUser(id: string | number, update) {
    return await this.user.findByIdAndUpdate(id, update);
  }

  async remove(id: string, request) {
    await this.verify(request.user.id, id);
    const user = await this.user.findById(id);
    for (const collection of user.collections as CollectionDocument[]) {
      await this.collectionService.remove(collection._id, request);
    }
    return await user.delete();
  }

  async unbindCollection(collection: CollectionDocument, user_id: string) {
    return await this.user.findByIdAndUpdate(
      user_id,
      { $pull: { collections: collection._id } },
      { multi: true },
    );
  }

  async hashPassword(password: string) {
    return await hash(password, 3);
  }

  async findAndAddCollection(userId: string, collection: CollectionDocument) {
    return await this.user.findByIdAndUpdate(
      userId,
      { $push: { collections: collection._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async findAll(query: getPaginationData): Promise<paginationResult<User>> {
    const { findQuery, count } = await paginationQuery<User>(this.user, {
      query,
    });
    const results = await findQuery.exec();
    return { results, count };
  }

  private async verify(user_id: string, action_user_id: string) {
    if (await this.authService.verifyUser(user_id)) return true;
    const user = await this.user.findById(action_user_id);
    if (user._id !== user_id) throw new ForbiddenException();
  }
}
