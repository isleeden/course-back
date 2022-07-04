import FieldTypes from 'src/types/field-types';

export type CreateFieldDto = {
  name: string;
  collection_id: string;
  type: FieldTypes;
};

export type UpdateFieldDto = {
  id: string;
  name: string;
  type: FieldTypes;
};
