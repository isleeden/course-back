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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  editCollection(
    @Param() params,
    @Body() collectionDto: EditCollectionDto,
    @Req() request,
  ) {
    return this.collectionService.update(params.id, collectionDto, request);
  }

  @Get(':id')
  getCollection(@Param() params) {
    return this.collectionService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeCollections(@Param() params, @Req() request) {
    return this.collectionService.remove(params.id, request);
  }
}
