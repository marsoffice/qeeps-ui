import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit, OnDestroy {
  @Input('column') column!: ColumnDto;
  @Input('cellFormControl') cellFormControl!: FormControl;
  @Input('editMode') editMode: boolean | undefined;
  @Input('isMobile') isMobile: boolean | undefined;
  columnDataTypes = ColumnDataType;
  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  getFormControlErrorsMessage() {
    if (!this.cellFormControl.invalid || !this.cellFormControl.touched) {
      return '';
    }

    return Object.keys(this.cellFormControl.errors!)
      .map(x => this.translateService.instant(`ui.forms.cell.validationFailed.${x}`))
      .join("\r\n");

  }
}
