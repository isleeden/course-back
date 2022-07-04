import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Field, FieldSchema } from './field.schema';
import { FieldService } from './field.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Field.name, schema: FieldSchema }]),
  ],
  providers: [FieldService],
  exports: [FieldService],
})
export class FieldModule {}
