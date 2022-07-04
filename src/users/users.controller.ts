import { Controller, Get, Param, Query } from '@nestjs/common';
import { getPaginationData } from 'src/types/get-data.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query() paginationQuery: getPaginationData) {
    return this.usersService.findAll(paginationQuery);
  }

  @Get('/:id')
  findOne(@Param() params) {
    return this.usersService.findById(params.id);
  }
}
