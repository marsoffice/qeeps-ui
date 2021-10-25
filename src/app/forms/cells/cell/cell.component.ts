import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  @Input('placeholder') placeholder: string | undefined;
  @Output('change') change = new EventEmitter<any>();
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
      .map(x => this.translateService.instant(`ui.forms.cell.validationFailed.${x.toLowerCase()}`))
      .join("\r\n");

  }
}
