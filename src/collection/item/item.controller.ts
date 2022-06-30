import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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

  @Put('/:id')
  updateItem(@Param() params, @Body() itemDto: CreateItemDto) {
    return this.itemService.update(params.id, itemDto);
  }

  @Patch('/remove_tag')
  removeTag(@Body() removeTagDto: RemoveTagDto) {
    return this.itemService.removeTag(removeTagDto);
  }

  @Get('/:id')
  getItem(@Param() params) {
    return this.itemService.findItem(params.id);
  }

  @Get('/collection/:id')
  getItems(@Param() params, @Query() query: getPaginationData) {
    return this.itemService.findCollectionItems(params.id, query);
  }

  @Delete(':id')
  removeItem(@Param() params) {
    return this.itemService.remove(params.id);
  }
}
