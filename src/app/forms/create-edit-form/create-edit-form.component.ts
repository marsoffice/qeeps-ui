import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-create-edit-form',
  templateUrl: './create-edit-form.component.html',
  styleUrls: ['./create-edit-form.component.scss']
})
export class CreateEditFormComponent implements OnInit, OnDestroy {
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

  isMobile = false;

  private _destroy: Subscription[] = [];

  now = new Date();


  constructor(private actRoute: ActivatedRoute, private mediaObserver: MediaObserver, private translate: TranslateService) {
    this.columnDataTypesList = this.generateColumnDataTypes();

    this.columns = new FormArray([]);
    this.rows = new FormArray([]);

    this.form = new FormGroup({
      form: new FormGroup({
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
      }),
      sendEmailNotifications: new FormControl(false)
    });

    this._destroy.push(
      this.form.get('form')!.get('isRecurrent')!.valueChanges.subscribe(isr => {
        if (isr) {
          this.form.get('form')!.get('cronExpression')!.addValidators([Validators.required]);
        } else {
          this.form.get('form')!.get('cronExpression')!.removeValidators([Validators.required]);
          this.form.get('form')!.get('cronExpression')!.setValue(null);
        }
      })
    );

    this._destroy.push(
      this.form.get('form')!.get('isPinned')!.valueChanges.subscribe(isp => {
        if (!isp) {
          this.form.get('form')!.get('pinnedUntilDate')!.setValue(null);
        }
      })
    );
  }

  ngOnInit(): void {
    this._destroy.push(
      this.mediaObserver.asObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isActive('xs');
      })
    );
    this.actRoute.params.subscribe(params => {
      this.id = params.id;

    });
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
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
    const reference = `c_${uuid().replace(/-/g, '_')}`;
    const cfg = this.createColumnFormGroup(reference);
    this.columns.push(
      cfg
    );
    if (this.rows.length > 0) {
      for (let i = 0; i < this.rows.length; i++) {
        const rowFg = this.rows.at(i) as FormGroup;
        rowFg.addControl(reference, new FormControl());
      }
    }
    setTimeout(() => {
      this.columnsWrapper.nativeElement.scrollLeft = this.columnsWrapper.nativeElement.scrollWidth;
    });
  }

  removeColumn(i: number) {
    const reference = this.columns.at(i).value.reference;
    this.columns.removeAt(i);
    if (this.rows.length === 0) {
      return;
    }
    if (this.columns.length === 0) {
      this.rows.clear();
    } else {
      for (const row of this.rows.controls) {
        const fg = row as FormGroup;
        const controlToDelete = fg.get(reference);
        if (controlToDelete != null) {
          fg.removeControl(reference);
          continue;
        }
      }
    }
    this.matTable.renderRows();
  }

  addRow() {
    this.rows.push(
      this.createRowFormGroup()
    );
    const radFc = this.form.get('form')!.get('rowAppendDisabled')!;
    if (!radFc.touched) {
      radFc.setValue(true);
    }
    this.matTable.renderRows();
  }

  removeRow(i: number) {
    this.rows.removeAt(i);
    const radFc = this.form.get('form')!.get('rowAppendDisabled')!;
    if (this.rows.length === 0) {
      radFc.setValue(false);
    }
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
      if (list.indexOf(value) === -1) {
        list.push(value);
      }
      this.columns.controls[i].get('dropdownOptions')!.setValue(list);
    }
    event.chipInput!.clear();
  }

  addTag(event: MatChipInputEvent): void {
    const value: string = (event.value || '').trim();

    if (value) {
      const list = this.form.get('form')!.get('tags')!.value;
      if (list.indexOf(value) === -1) {
        list.push(value);
      }
      this.form.get('form')!.get('tags')!.setValue(list);
    }
    event.chipInput!.clear();
  }

  removeTag(i: number) {
    const list: string[] = this.form.get('form')!.get('tags')!.value;
    list.splice(i, 1);
    this.form.get('form')!.get('tags')!.setValue(list);
  }

  getCellFormControl(rowIndex: number, col: ColumnDto) {
    return (this.rows.at(rowIndex) as FormGroup).get(col.reference) as FormControl;
  }

  columnDataTypeChanged(col: ColumnDto) {
    if (this.rows.length === 0) {
      return;
    }
    for (let i = 0; i < this.rows.length; i++) {
      const rowFg = this.rows.at(i) as FormGroup;
      rowFg.get(col.reference)?.setValue(null);
    }
  }

  reorderColumns(event: CdkDragDrop<any>) {
    const theFg = this.columns.at(event.previousIndex);
    const swappedFg = this.columns.at(event.currentIndex);
    this.columns.setControl(event.previousIndex, swappedFg);
    this.columns.setControl(event.currentIndex, theFg);
    if (this.rows.length > 0) {
      this.matTable.renderRows();
    }
  }

  trackByIndex(index: number, item: AbstractControl) {
    return index;
  }

  getColumnFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  castToAny(x: any): any {
    return x as any;
  }

  getFormControl(a: string) {
    return this.form.get('form')!.get(a) as FormControl;
  }

  private createColumnFormGroup(reference: string) {
    return new FormGroup({
      name: new FormControl(null, [Validators.required]),
      isRequired: new FormControl(false),
      dropdownOptions: new FormControl([], [this.dropdownOptionsValidator.bind(this)]),
      isFrozen: new FormControl(false),
      isHidden: new FormControl(false),
      dataType: new FormControl(ColumnDataType.StringSingleLine, [Validators.required]),
      allowedExtensions: new FormControl([]),
      reference: new FormControl(reference, [Validators.required])
    });
  }

  private createRowFormGroup() {
    const fcs: { [key: string]: AbstractControl; } = {};
    const colDtos = this.columns.value as ColumnDto[];
    for (let i = 0; i < colDtos.length; i++) {
      const colDto = colDtos[i];
      fcs[colDto.reference] = new FormControl();
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
