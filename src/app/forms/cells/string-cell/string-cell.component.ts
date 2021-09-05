import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-string-cell',
  templateUrl: './string-cell.component.html',
  styleUrls: ['./string-cell.component.scss']
})
export class StringCellComponent implements OnInit, OnDestroy {

  @Input('parentFormGroup') parentFormGroup!: FormGroup;
  @Input('column') column!: ColumnDto;
  @Input('columnIndex') columnIndex!: number;
  @Input('rowIndex') rowIndex!: number;
  @Input('value') value: string | undefined;

  columnDataTypes = ColumnDataType;

  fc: FormControl | undefined;
  constructor() { }

  ngOnInit(): void {
    const validators: ValidatorFn[] = [];
    if (this.column.isRequired) {
      validators.push(Validators.required);
    }
    this.fc = new FormControl(this.value, validators);
    if (this.column.isFrozen) {
      this.fc.disable();
    }
    this.parentFormGroup.addControl(`c${this.columnIndex}`, this.fc);
  }

  ngOnDestroy(): void {

  }

}
