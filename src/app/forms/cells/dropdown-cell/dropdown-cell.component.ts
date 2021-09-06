import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-dropdown-cell',
  templateUrl: './dropdown-cell.component.html',
  styleUrls: ['./dropdown-cell.component.scss']
})
export class DropdownCellComponent implements OnInit {
  @Input('column') column!: ColumnDto;
  @Input('cellFormControl') cellFormControl!: FormControl;
  @Input('editMode') editMode: boolean | undefined;
  @Input('isMobile') isMobile: boolean | undefined;

  columnDataTypes = ColumnDataType;
  constructor() { }

  ngOnInit(): void {
  }

}
