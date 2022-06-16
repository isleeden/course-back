import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateItemDto } from './item/dto/create-item.dto';

@Controller('collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Post('/create')
  createCollection(@Body() collectionDto: CreateCollectionDto) {
    return this.collectionService.createCollection(collectionDto);
  }

  @Get()
  getCollections(@Query() query: getPaginationData) {
    return this.collectionService.findAll(query);
  }
}
