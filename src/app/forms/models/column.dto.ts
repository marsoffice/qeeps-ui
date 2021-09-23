import { ColumnDataType } from './column-data-type';

export interface ColumnDto {
  name: string;
  isRequired: boolean;
  dropdownOptions?: string[];
  isFrozen: boolean;
  isHidden: boolean;
  dataType: ColumnDataType;
  allowedExtensions?: string[];
  reference: string;
}
