import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';


@Component({
  selector: 'app-boolean-cell',
  templateUrl: './boolean-cell.component.html',
  styleUrls: ['./boolean-cell.component.scss']
})
export class BooleanCellComponent implements OnInit {
  @Input('column') column!: ColumnDto;
  @Input('cellFormControl') cellFormControl!: FormControl;
  @Input('editMode') editMode: boolean | undefined;
  @Input('isMobile') isMobile: boolean | undefined;

  columnDataTypes = ColumnDataType;

  constructor() { }

  ngOnInit(): void {
  }

}
