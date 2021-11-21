import { ErrorDto } from 'src/app/models/error.dto';

export interface FileDto {
  fileId?: string;
  userId?: string;
  location?: string;
  uploadSessionId?: string;
  filename: string;
  sizeInBytes: number;
  fileRef?: File;
  errors?: ErrorDto[];
  isUploading?: boolean;
}
