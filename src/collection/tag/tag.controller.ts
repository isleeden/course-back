import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  getItem(@Query() params) {
    return this.tagService.findTagBySubstring(params.search);
  }
}
