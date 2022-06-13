import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/schemas/users.schema';
import { PaginationQuery } from 'src/types/pagination-query';
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
  findAll(@Query() paginationQuery: PaginationQuery) {
    return this.usersService.findAll(paginationQuery);
  }
}
