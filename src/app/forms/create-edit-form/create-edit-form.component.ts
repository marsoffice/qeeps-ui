import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KeyValue } from 'src/app/models/key-value';
import { environment } from 'src/environments/environment';
import { ColumnDataType } from '../models/column-data-type';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTable } from '@angular/material/table';
import { ColumnDto } from '../models/column.dto';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-edit-form',
  templateUrl: './create-edit-form.component.html',
  styleUrls: ['./create-edit-form.component.scss']
})
export class CreateEditFormComponent implements OnInit {
  form: FormGroup;
  columns: FormArray;
  rows: FormArray;
  id: string | null = null;
  readonly separatorKeysCodes = [ENTER, COMMA, TAB] as const;

  @ViewChild('columnsWrapper', { static: true, read: ElementRef })
  private columnsWrapper!: ElementRef<HTMLDivElement>;

  @ViewChild('matTable', { static: true }) matTable!: MatTable<AbstractControl>;

  acceptedFileExtensions = environment.acceptedFileExtensions.join();

  columnDataTypesList: KeyValue<string, ColumnDataType>[];
  columnDataTypes = ColumnDataType;
  allowedExtensions = environment.acceptedFileExtensions;

  constructor(private actRoute: ActivatedRoute) {
    this.columnDataTypesList = this.generateColumnDataTypes();

    this.columns = new FormArray([]);
    this.rows = new FormArray([]);

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      description: new FormControl(),
      attachments: new FormControl([]),
      isLocked: new FormControl(false),
      lockedUntilDate: new FormControl(),
      rowAppendDisabled: new FormControl(false),
      isRecurrent: new FormControl(false),
      cronExpression: new FormControl(),
      isPinned: new FormControl(false),
      pinnedUntilDate: new FormControl(),
      tags: new FormControl([]),
      columns: this.columns,
      rows: this.rows,
      formAccesses: new FormControl([])
    });
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params => {
      this.id = params.id;

    });
  }

  save() {
    console.log(this.form.value);
  }

  get columnsToDisplay() {
    const cols = this.columns.controls.map((_, i) => i + '');
    if (this.rows.length > 0) {
      cols.push('delrow');
    }
    return cols;
  }

  addColumn() {
    const cfg = this.createColumnFormGroup();
    this.columns.push(
      cfg
    );
    if (this.rows.length > 0) {
      for (let i = 0; i < this.rows.length; i++) {
        const rowFg = this.rows.at(i) as FormGroup;
        rowFg.addControl('c' + (this.columns.length - 1), new FormControl());
      }
    }
    setTimeout(() => {
      this.columnsWrapper.nativeElement.scrollLeft = this.columnsWrapper.nativeElement.scrollWidth;
    });
  }

  removeColumn(i: number) {
    this.columns.removeAt(i);
    if (this.rows.length === 0) {
      return;
    }
    if (this.columns.length === 0) {
      this.rows.clear();
    } else {
      for (const row of this.rows.controls) {
        const fg = row as FormGroup;
        const controlKeys = Object.keys(fg);
        if (i === controlKeys.length - 1) {
          fg.removeControl(`c${i}`);
          return;
        }
        for (let j = i; j < controlKeys.length - 1; j++) {
          fg.setControl(`c${j}`, fg.get(`c${(j + 1)}`)!);
        }
        fg.removeControl(`c${(controlKeys.length - 1)}`);
      }
    }
    this.matTable.renderRows();
  }

  addRow() {
    this.rows.push(
      this.createRowFormGroup()
    );
    this.matTable.renderRows();
  }

  removeRow(i: number) {
    this.rows.removeAt(i);
    this.matTable.renderRows();
  }

  toCamelCase(k: string) {
    if (k == null || k.length === 0) {
      return k;
    }
    if (k.length === 1) {
      return k.toLowerCase();
    }
    return k[0].toLowerCase() + k.substring(1);
  }

  removeDropdownOption(j: number, i: number) {
    const list: string[] = this.columns.controls[i].get('dropdownOptions')!.value;
    list.splice(j, 1);
    this.columns.controls[i].get('dropdownOptions')!.setValue(list);
  }

  addDropdownOption(event: MatChipInputEvent, i: number): void {
    const value: string = (event.value || '').trim();

    if (value) {
      const list = this.columns.controls[i].get('dropdownOptions')!.value;
      list.push(value);
      this.columns.controls[i].get('dropdownOptions')!.setValue(list);
    }
    event.chipInput!.clear();
  }

  addTag(event: MatChipInputEvent): void {
    const value: string = (event.value || '').trim();

    if (value) {
      const list = this.form.get('tags')!.value;
      list.push(value);
      this.form.get('tags')!.setValue(list);
    }
    event.chipInput!.clear();
  }

  removeTag(i: number) {
    const list: string[] = this.form.get('tags')!.value;
    list.splice(i, 1);
    this.form.get('tags')!.setValue(list);
  }

  getCellFormControl(rowIndex: number, colIndex: number) {
    return (this.rows.at(rowIndex) as FormGroup).get('c' + colIndex) as FormControl;
  }

  columnDataTypeChanged(colIndex: number) {
    if (this.rows.length === 0) {
      return;
    }
    for (let i = 0; i < this.rows.length; i++) {
      const rowFg = this.rows.at(i) as FormGroup;
      rowFg.get('c' + colIndex)?.setValue(null);
    }
  }

  reorderColumns(event: CdkDragDrop<any>) {
    const theFg = this.columns.at(event.previousIndex);
    const swappedFg = this.columns.at(event.currentIndex);
    this.columns.setControl(event.previousIndex, swappedFg);
    this.columns.setControl(event.currentIndex, theFg);
    if (this.rows.length > 0) {
      for (let i = 0; i < this.rows.length; i++) {
        const rowFg = this.rows.at(i) as FormGroup;
        const theValue = rowFg.get(`c${event.previousIndex}`)?.value;
        const swappedValue = rowFg.get(`c${event.currentIndex}`)?.value;
        rowFg.get(`c${event.previousIndex}`)?.setValue(swappedValue);
        rowFg.get(`c${event.currentIndex}`)?.setValue(theValue);
      }
      this.matTable.renderRows();
    }
  }

  trackByIndex(index: number, item: AbstractControl) {
    return index;
  }

  getColumnFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }


  private createColumnFormGroup() {
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      isRequired: new FormControl(false),
      dropdownOptions: new FormControl([], [this.dropdownOptionsValidator.bind(this)]),
      isFrozen: new FormControl(false),
      isHidden: new FormControl(false),
      dataType: new FormControl(ColumnDataType.StringSingleLine, [Validators.required]),
      allowedExtensions: new FormControl([])
    });
  }

  private createRowFormGroup() {
    const fcs: { [key: string]: AbstractControl; } = {};
    const colDtos = this.columns.value as ColumnDto[];
    for (let i = 0; i < colDtos.length; i++) {
      fcs['c' + i] = new FormControl();
    }
    return new FormGroup(fcs);
  }

  private dropdownOptionsValidator(control: AbstractControl) {
    if (!control.root || !control.parent) {
      return null;
    }
    const ddoFg = control as FormControl;
    const formParent = control.root.parent;
    if (formParent?.get('dataType')?.value === ColumnDataType.Dropdown && (ddoFg.value == null || ddoFg.value.length === 0)) {
      return {
        required: true
      };
    }
    return null;
  }

  private generateColumnDataTypes(): KeyValue<string, ColumnDataType>[] {
    const enumAny = ColumnDataType as any;
    return Object.keys(enumAny).filter(k => Number.isNaN(Number.parseInt(k)))
      .map(k => ({ key: k, value: enumAny[k] }));
  }
}
