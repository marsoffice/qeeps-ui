import { Component, OnInit } from '@angular/core';
import { FormDto } from '../models/form.dto';
import { FormsService } from '../services/forms.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  forms: FormDto[] | undefined;
  constructor(private formsService: FormsService) { }

  ngOnInit(): void {

  }

}
