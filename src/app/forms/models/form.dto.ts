import { ColumnDto } from './column.dto';
import { FormAccessDto } from './form-access.dto';
import { RowDto } from './row.dto';
import {FileDto} from '../../shared/files/models/file.dto';

export interface FormDto {
  id: string;
  userId: string;
  createdDate: string;
  title: string;
  description?: string;
  attachments?: FileDto[];
  isLocked: boolean;
  lockedUntilDate?: string;
  rowAppendDisabled: boolean;
  isRecurrent: boolean;
  cronExpression?: string;
  isPinned: boolean;
  pinnedUntilDate?: string;
  tags?: string[];
  columns?: ColumnDto[];
  rows?: RowDto[];
  formAccesses?: FormAccessDto[];
}
