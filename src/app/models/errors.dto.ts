import { ErrorDto } from './error.dto';

export type ErrorsDto = {
  [key: string]: ErrorDto[];
}
