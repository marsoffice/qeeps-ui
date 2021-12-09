import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnDataType } from '../../models/column-data-type';
import { ColumnDto } from '../../models/column.dto';

@Component({
  selector: 'app-dropdown-cell',
  templateUrl: './dropdown-cell.component.html',
  styleUrls: ['./dropdown-cell.component.scss']
})
export class DropdownCellComponent implements OnInit, OnChanges {
  @Input('column') column!: ColumnDto;
  @Input('cellFormControl') cellFormControl!: FormControl;
  @Input('editMode') editMode: boolean | undefined;
  @Input('isMobile') isMobile: boolean | undefined;
  @Input('placeholder') placeholder: string | undefined;
  @Output('change') change = new EventEmitter<any>();
  drawn = true;

  columnDataTypes = ColumnDataType;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.column != null && !changes.column.isFirstChange()) {
      const prev: ColumnDto = changes.column.previousValue;
      const current: ColumnDto = changes.column.currentValue;
      if (prev.multipleValues !== current.multipleValues) {
        this.redraw();
      }
    }
  }

  private redraw() {
    this.drawn = false;
    setTimeout(() => {
      this.drawn = true;
    });
  }
}
