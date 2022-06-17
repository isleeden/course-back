import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('/')
  addItem(@Body() itemDto: CreateItemDto) {
    return this.itemService.addItem(itemDto);
  }

  @Put('/')
  updateItem(@Body() itemDto: CreateItemDto) {
    return this.itemService.addItem(itemDto);
  }
}
