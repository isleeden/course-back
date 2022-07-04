import { getPaginationData } from 'src/types/get-data.dto';
import { FindTagBySubstring } from './dto/find-tag-substring';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get('/search')
  getTagsBySubstring(@Query() params: FindTagBySubstring) {
    return this.tagService.findTagBySubstring(params.search);
  }

  @Get()
  getTags(@Query() params: getPaginationData) {
    return this.tagService.findTags(params);
  }

  @Get(':id')
  getTag(@Param() params) {
    return this.tagService.findTag(params.id);
  }
}
