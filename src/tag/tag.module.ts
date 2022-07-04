import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Tag, TagSchema } from './tag.schema';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
