import { FieldValueModule } from './../field-value/field-value.module';
import { CollectionModule } from './../collection/collection.module';
import { TagModule } from './../tag/tag.module';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { Item, ItemSchema } from './item.schema';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    forwardRef(() => FieldValueModule),
    TagModule,
    CollectionModule,
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
