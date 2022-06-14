import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query() paginationQuery: getPaginationData) {
    return this.usersService.findAll(paginationQuery);
  }
}
