import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { FormDto } from '../models/form.dto';
import { FormsService } from '../services/forms.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  forms: FormDto[] | undefined;
  private _destroy: Subscription[] = [];

  @ViewChild('calendar', { static: true }) calendar!: MatCalendar<any>;
  constructor(private formsService: FormsService) { }

  ngOnInit(): void {
    this._destroy.push(
      this.calendar.stateChanges.subscribe(() => {
        console.log(this.calendar);
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }

}
