import { ColumnDataType } from './column-data-type';

export interface ColumnDto {
  name: string;
  multipleValues: boolean;
  isRequired: boolean;
  dropdownOptions?: string[];
  isFrozen: boolean;
  isHidden: boolean;
  dataType: ColumnDataType;
  allowedExtensions?: string[];
  reference: string;
  min?: any;
  max?: any;
  minLength?: number;
  maxLength?: number;
}
