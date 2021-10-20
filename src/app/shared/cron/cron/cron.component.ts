import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  allRecurrenceTypes = RecurrenceType;
  _value: string | undefined;
  disabled = false;
  touched = false;
  onChange = (v: any) => { };
  onTouched = () => { };

  selectedRecurrenceType = RecurrenceType.Year;
  selectedMinute: number | null = 0;
  allMinutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];

  selectedHour: number | null = 0;
  allHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  selectedDay: number | null = 1;
  allDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedMonth: number | null = 1;

  selectedYear: number | null = null;

  selectedWeekday: string | null = null;
  selectedSecond: number | null = 0;
  allWeekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

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
    if (v != null) {
      const splitBySpace = v.split(' ');
      if (splitBySpace.length !== 6) {
        return;
      }
      if (splitBySpace[0] === '*') {
        this.selectedSecond = null;
      } else {
        this.selectedSecond = +splitBySpace[0];
        this.selectedRecurrenceType = RecurrenceType.Minute;
      }
      if (splitBySpace[1] === '*') {
        this.selectedMinute = null;
      } else {
        this.selectedMinute = +splitBySpace[1];
        this.selectedRecurrenceType = RecurrenceType.Hour;
      }
      if (splitBySpace[2] === '*') {
        this.selectedHour = null;
      } else {
        this.selectedHour = +splitBySpace[2];
        this.selectedRecurrenceType = RecurrenceType.Day;
      }
      if (splitBySpace[3] === '*') {
        this.selectedDay = null;
      } else {
        this.selectedDay = +splitBySpace[3];
        this.selectedRecurrenceType = RecurrenceType.Month;
      }
      if (splitBySpace[4] === '*') {
        this.selectedMonth = null;
      } else {
        this.selectedMonth = +splitBySpace[4];
        this.selectedRecurrenceType = RecurrenceType.Year;
      }
      if (splitBySpace[5] === '*') {
        this.selectedWeekday = null;
      } else {
        this.selectedWeekday = splitBySpace[5];
        this.selectedRecurrenceType = RecurrenceType.Week;
      }
      this._value = v;
    } else {
      this._value = v;
    }
    this.onChange(this._value);
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

  onSelectionChange() {
    let newValue = `${this.selectedSecond ?? '*'} ${this.selectedMinute ?? '*'} ${this.selectedHour ?? '*'} ${this.selectedDay ?? '*'} ${this.selectedMonth ?? '*'} ${this.selectedWeekday ?? '*'}`;
    console.log(newValue);
    this.writeValue(newValue);
    this.markAsTouched();
  }

  onRecurrenceTypeChange() {
    if (this.selectedRecurrenceType === RecurrenceType.Second) {
      this.selectedSecond = 0;
      this.selectedMinute = null;
      this.selectedHour = null;
      this.selectedDay = null;
      this.selectedMonth = null;
      this.selectedYear = null;
      this.selectedWeekday = null;
    }
    if (this.selectedRecurrenceType === RecurrenceType.Minute) {
      this.selectedMinute = 0;
      this.selectedHour = null;
      this.selectedDay = null;
      this.selectedMonth = null;
      this.selectedYear = null;
      this.selectedWeekday = null;
    }
    if (this.selectedRecurrenceType === RecurrenceType.Hour) {
      this.selectedHour = 0;
      this.selectedDay = null;
      this.selectedMonth = null;
      this.selectedYear = null;
      this.selectedWeekday = null;
    }
    if (this.selectedRecurrenceType === RecurrenceType.Day) {
      this.selectedDay = 1;
      this.selectedMonth = null;
      this.selectedYear = null;
      this.selectedWeekday = null;
    }
    if (this.selectedRecurrenceType === RecurrenceType.Week) {
      this.selectedDay = null;
      this.selectedMonth = null;
      this.selectedYear = null;
      this.selectedWeekday = 'MON';
    }
    if (this.selectedRecurrenceType === RecurrenceType.Month) {
      this.selectedMonth = 1;
      this.selectedYear = null;
      this.selectedWeekday = null;
    }
    if (this.selectedRecurrenceType === RecurrenceType.Year) {
      this.selectedYear = null;
      this.selectedWeekday = null;
    }
    this.onSelectionChange();
  }
}
