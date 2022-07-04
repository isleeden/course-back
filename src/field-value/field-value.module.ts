import { ItemModule } from 'src/item/item.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FieldModule } from 'src/field/field.module';
import { FieldValue, FieldValueSchema } from './field-value.schema';
import { FieldValueService } from './field-value.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldValue.name, schema: FieldValueSchema },
    ]),
    forwardRef(() => ItemModule),
    FieldModule,
  ],
  providers: [FieldValueService],
  exports: [FieldValueService],
})
export class FieldValueModule {}
