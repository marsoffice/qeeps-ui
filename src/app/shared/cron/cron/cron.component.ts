import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { RecurrenceType } from '../models/recurrence-type';

@Component({
  selector: 'app-cron',
  templateUrl: './cron.component.html',
  styleUrls: ['./cron.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CronComponent
    }
  ]
})
export class CronComponent implements OnInit, ControlValueAccessor {
  @Input() disabledRecurrenceTypes: RecurrenceType[] | undefined;
  recurrenceTypes: { key: string, value: RecurrenceType; }[] | undefined;
  _value: string | undefined;
  disabled = false;
  touched = false;
  onChange = (v: any) => { };
  onTouched = () => { };

  selectedRecurrenceType = RecurrenceType.Year;


  constructor() { }

  ngOnInit(): void {
    this.recurrenceTypes = Object.keys(RecurrenceType as any).filter((x: any) => Number.isNaN(parseInt(x)))
      .map((x: any) => ({
        key: x.toLowerCase(),
        value: (RecurrenceType as any)[x]
      }));
    if (this.disabledRecurrenceTypes != null) {
      this.recurrenceTypes = this.recurrenceTypes!.filter(x => this.disabledRecurrenceTypes!.indexOf(x.value) === -1);
    }
  }

  writeValue(v: string) {
    this._value = v;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }


  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
