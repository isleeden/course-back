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
import { CollectionService } from './collection.service';
import {
  CreateCollectionDto,
  EditCollectionDto,
} from './dto/create-collection.dto';
import { CollectionGuard } from './collection.guard';

@Controller('collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createCollection(@Body() collectionDto: CreateCollectionDto, @Req() request) {
    return this.collectionService.createCollection(collectionDto, request);
  }

  @Get()
  getCollections(@Query() query: getPaginationData) {
    return this.collectionService.findAll(query);
  }

  @Get('/mostitems')
  getMostItemsCollections(@Query() query: getPaginationData) {
    return this.collectionService.findMostItems(query);
  }

  @UseGuards(CollectionGuard)
  @Put(':id')
  editCollection(
    @Param('id') id: string,
    @Body() collectionDto: EditCollectionDto,
  ) {
    return this.collectionService.update(id, collectionDto);
  }

  @Get(':id')
  getCollection(@Param('id') id: string) {
    return this.collectionService.findById(id);
  }

  @UseGuards(CollectionGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeCollections(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }
}
