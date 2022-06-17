import FieldTypes from 'src/types/field-types';

export class CreateFieldDto {
  name: string;
  collection_id: string;
  type: FieldTypes;
}
