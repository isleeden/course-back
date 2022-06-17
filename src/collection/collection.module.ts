import { AuthModule } from 'src/auth/auth.module';
import { FieldValue, FieldValueSchema } from './field-value/field-value.schema';
import { Field, FieldSchema } from './field/field.schema';
import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection, CollectionSchema } from './collection.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './item/item.schema';
import { Tag, TagSchema } from './tag/Tag.schema';
import { TagService } from './tag/tag.service';
import { ItemController } from './item/item.controller';
import { ItemService } from './item/item.service';
import { UsersModule } from 'src/users/users.module';
import { FieldService } from './field/field.service';
import { FieldController } from './field/field.controller';
import { FieldValueService } from './field-value/field-value.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    MongooseModule.forFeature([{ name: Field.name, schema: FieldSchema }]),
    MongooseModule.forFeature([
      { name: FieldValue.name, schema: FieldValueSchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  providers: [
    CollectionService,
    FieldValueService,
    TagService,
    ItemService,
    FieldService,
  ],
  controllers: [CollectionController, ItemController, FieldController],
})
export class CollectionModule {}
