import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';
import { getPaginationData } from 'src/types/get-data.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { RemoveTagDto } from './dto/remove-tag.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  addItem(@Body() itemDto: CreateItemDto) {
    return this.itemService.addItem(itemDto);
  }

  @Put()
  updateItem(@Body() itemDto: CreateItemDto) {
    return this.itemService.addItem(itemDto);
  }

  @Patch('/remove_tag')
  removeTag(@Body() removeTagDto: RemoveTagDto) {
    return this.itemService.removeTag(removeTagDto);
  }

  @Get()
  getItems(@Query() query: getPaginationData) {
    return this.itemService.getItems(query);
  }
}
