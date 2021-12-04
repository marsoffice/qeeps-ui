import { FormDto } from './form.dto';

export interface FormListResultDto {
  total: number;
  forms: FormDto[];
}
