import FieldTypes from 'src/types/field-types';

export class CreateCollectionDto {
  readonly name: string;
  readonly description: string;
  readonly fields: CollectionField[];
  readonly image: string | null;
}

export class EditCollectionDto extends CreateCollectionDto {
  readonly fields: CollectionField[];
}

export type CollectionField = {
  _id: string | undefined;
  name: string;
  type: FieldTypes;
};
