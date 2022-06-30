import { getByUserIdPaginationData } from '../types/get-data.dto';
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

  @Get('user')
  getUserCollections(@Query() query: getByUserIdPaginationData) {
    return this.collectionService.findByUserId(query);
  }

  @Get()
  getCollections(@Query() query: getPaginationData) {
    return this.collectionService.findAll(query);
  }

  @Put(':id')
  editCollection(@Param() params, @Body() collectionDto: EditCollectionDto) {
    return this.collectionService.update(params.id, collectionDto);
  }

  @Get(':id')
  getCollection(@Param() params) {
    return this.collectionService.findById(params.id);
  }

  @Delete(':id')
  removeCollections(@Param() params) {
    return this.collectionService.remove(params.id);
  }
}
