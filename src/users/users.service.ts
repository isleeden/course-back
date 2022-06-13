import { UserDocument } from './users.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { paginationResult } from 'src/types/pagination-result';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByName(name: string) {
    return this.userModel.findOne({ name }).exec();
  }

  async findAll(
    paginationQuery: getPaginationData,
  ): Promise<paginationResult<User>> {
    const findQuery = this.userModel.find().skip(paginationQuery.offset);
    findQuery.limit(paginationQuery.limit);
    const results = await findQuery;
    const count = await this.userModel.count();
    return { results, count };
  }
}
