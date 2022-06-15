import { UserDocument } from './users.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { paginationResult } from 'src/types/pagination-result';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async findByName(name: string) {
    return this.userModel.findOne({ name }).exec();
  }

  async updateUser(id: string | number, update) {
    return this.userModel.findByIdAndUpdate(id, update);
  }

  async hashPassword(password: string) {
    return await hash(password, 3);
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }

  async findAll(query: getPaginationData): Promise<paginationResult<User>> {
    const findQuery = this.userModel.find().skip(query.offset);
    findQuery.limit(query.limit);
    const results = await findQuery;
    const count = await this.userModel.count();
    return { results, count };
  }
}
