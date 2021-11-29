import { FormDto } from './form.dto';

export interface CreateEditFormDto {
  form: FormDto;
  sendEmailNotifications: boolean;
}
