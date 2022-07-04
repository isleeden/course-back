import { CreateFieldValueDto } from 'src/field-value/dto/create-field-value.dto';
export class CreateItemDto {
  name: string;
  collection_id: string;
  fieldValues: CreateFieldValueDto[];
  tags: string[];
}
