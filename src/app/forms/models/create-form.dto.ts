import { FormDto } from './form.dto';

export interface CreateFormDto {
  form: FormDto;
  sendEmailNotifications: boolean;
}
