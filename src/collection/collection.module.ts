import { FieldValue, FieldValueSchema } from './schemas/field-value.schema';
import { Field, FieldSchema } from './schemas/field.schema';
import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
    ]),
    MongooseModule.forFeature([
      { name: Field.name, schema: FieldSchema },
    ]),
    MongooseModule.forFeature([
      { name: FieldValue.name, schema: FieldValueSchema },
    ]),
    TagModule
  ],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {}
