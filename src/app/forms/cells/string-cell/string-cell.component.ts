import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-string-cell',
  templateUrl: './string-cell.component.html',
  styleUrls: ['./string-cell.component.scss']
})
export class StringCellComponent implements OnInit {
  @Input('column') column!: ColumnDto;
  @Input('cellFormControl') cellFormControl!: FormControl;
  @Input('editMode') editMode: boolean | undefined;
  @Input('isMobile') isMobile: boolean | undefined;
  @Input('placeholder') placeholder: string | undefined;
  @Output('change') change = new EventEmitter<any>();
  columnDataTypes = ColumnDataType;
  constructor() { }

  ngOnInit(): void {

  }
}
