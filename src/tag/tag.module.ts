import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag, TagSchema } from './Tag.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
