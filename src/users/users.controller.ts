import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/users/users.schema';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationQuery: getPaginationData) {
    return this.usersService.findAll(paginationQuery);
  }
}
