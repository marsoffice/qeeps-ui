import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-date-time-cell',
  templateUrl: './date-time-cell.component.html',
  styleUrls: ['./date-time-cell.component.scss']
})
export class DateTimeCellComponent implements OnInit {
  @Input('column') column!: ColumnDto;
  @Input('cellFormControl') cellFormControl!: FormControl;
  @Input('editMode') editMode: boolean | undefined;
  @Input('isMobile') isMobile: boolean | undefined;
  columnDataTypes = ColumnDataType;
  constructor() { }

  ngOnInit(): void {
  }

  castToAny(x: any) {
    return x as any;
  }
}
