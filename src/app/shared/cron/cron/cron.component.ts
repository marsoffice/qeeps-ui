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
  selectedMinute = 0;
  allMinutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];

  selectedHour = 0;
  allHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  selectedDay = 1;
  allDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedMonth = 1;

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

  padValue(x: number): string {
    if (x == null) {
      return x;
    }
    let str = x.toString();
    if (str.length === 1) {
      return `0${str}`;
    }
    return str;
  }
}
