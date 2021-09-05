import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-files-cell',
  templateUrl: './files-cell.component.html',
  styleUrls: ['./files-cell.component.scss']
})
export class FilesCellComponent implements OnInit {
  @Input('column') column!: ColumnDto;
  @Input('cellFormControl') cellFormControl!: FormControl;
  @Input('editMode') editMode: boolean | undefined;
  @Input('isMobile') isMobile: boolean | undefined;

  columnDataTypes = ColumnDataType;

  constructor() { }

  ngOnInit(): void {
  }

  generateAccept() {
    if (!this.column.allowedExtensions) {
      return undefined;
    }
    return this.column.allowedExtensions.join();
  }
}
