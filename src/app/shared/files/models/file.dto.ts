import { ErrorDto } from 'src/app/models/error.dto';

export interface FileDto {
  id?: string;
  userId?: string;
  filename: string;
  sizeInBytes: number;
  fileRef?: File;
  errors?: ErrorDto[];
  isUploading?: boolean;
}
