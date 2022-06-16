import { UserDocument } from './users.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Collection } from 'mongoose';
import { User } from 'src/users/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { paginationResult } from 'src/types/pagination-result';
import { hash, compare } from 'bcrypt';
import { CollectionDocument } from 'src/collection/collection.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>) {}

  async create(userDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.user(userDto);
    return await createdUser.save();
  }

  async findByName(name: string) {
    return this.user.findOne({ name }).exec();
  }

  async updateUser(id: string | number, update) {
    return await this.user.findByIdAndUpdate(id, update);
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

  async comparePasswords(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }

  async findAll(query: getPaginationData): Promise<paginationResult<User>> {
    const findQuery = this.user.find().skip(query.offset);
    findQuery.limit(query.limit);
    const results = await findQuery;
    const count = await this.user.count();
    return { results, count };
  }
}
