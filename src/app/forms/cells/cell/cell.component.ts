import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit, OnDestroy {
  @Input('parentFormGroup') parentFormGroup!: FormGroup;
  @Input('column') column!: ColumnDto;
  @Input('columnIndex') columnIndex!: number;
  @Input('rowIndex') rowIndex!: number;
  @Input('value') value: any | undefined;

  columnDataTypes = ColumnDataType;
  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
