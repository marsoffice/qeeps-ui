import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-forms-calendar',
  templateUrl: './forms-calendar.component.html',
  styleUrls: ['./forms-calendar.component.scss']
})
export class FormsCalendarComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    firstDay: 1,
    events: [
      { title: 'event 1', date: '2021-08-12' },
      { title: 'event 2', date: '2021-08-13' }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
