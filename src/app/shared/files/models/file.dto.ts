export interface FileDto {
  id?: string;
  userId?: string;
  filename: string;
  sizeInBytes: number;
  fileRef?: File;
  error?: string;
  isUploading?: boolean;
}
