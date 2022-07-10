import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { getPaginationData } from 'src/types/get-data.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';
import { ItemGuard } from './item.auth.guard';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  getItems(@Query() query: getPaginationData) {
    return this.itemService.findItems(query);
  }

  @Get('/:id')
  getItem(@Param('id') id: string) {
    return this.itemService.findItem(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addItem(@Body() itemDto: CreateItemDto, @Req() request) {
    return this.itemService.addItem(itemDto, request);
  }

  @UseGuards(ItemGuard)
  @Put('/:id')
  updateItem(@Param('id') id: string, @Body() itemDto: CreateItemDto) {
    return this.itemService.update(id, itemDto);
  }

  @UseGuards(ItemGuard)
  @Delete(':id')
  removeItem(@Param('id') id: string) {
    return this.itemService.remove(id);
  }
}
