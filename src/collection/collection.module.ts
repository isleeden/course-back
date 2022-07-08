import { AuthModule } from 'src/auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { Collection, CollectionSchema } from './collection.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { FieldModule } from 'src/field/field.module';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    AuthModule,
    FieldModule,
    forwardRef(() => UsersModule),
    forwardRef(() => ItemModule),
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
