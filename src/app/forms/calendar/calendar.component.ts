import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToastService } from 'src/app/shared/toast/services/toast.service';
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
  contentHeight: number | undefined;
  private startDate: Date | undefined;
  private endDate: Date | undefined;
  isLoading = false;
  initialLoaded = false;

  @ViewChild('calendar', { static: true }) calendar!: MatCalendar<any>;

  constructor(private formsService: FormsService,
    private translateService: TranslateService,
    private stateService: StateService,
    private toastService: ToastService,
    private dateAdapter: DateAdapter<any>) { }

  ngOnInit(): void {

    this._destroy.push(
      this.translateService.onLangChange.subscribe(e => {
        this.dateAdapter.setLocale(e.lang);
      })
    );

    this._destroy.push(
      this.stateService.get<number>("contentHeight").subscribe(ch => {
        this.contentHeight = ch;
      })
    );

    this._destroy.push(
      this.calendar.stateChanges.subscribe(() => {
        if (!this.initialLoaded) {
          this.initialLoaded = true;
          return;
        }
        setTimeout(() => {
          this.isLoading = true;
          this.startDate = new Date(this.calendar.activeDate.getTime());
          this.startDate.setDate(1);
          this.startDate.setHours(0);
          this.startDate.setMinutes(0);
          this.startDate.setSeconds(0);
          this.startDate.setMilliseconds(0);

          this.endDate = new Date(this.startDate.getTime());
          this.endDate.setMonth(this.endDate.getMonth() + 1);
          this.formsService.getForms(undefined, undefined,
            this.startDate.toISOString(), this.endDate.toISOString()).subscribe({
              next: forms => {
                this.forms = forms;
                for (const row of this.calendar.monthView._matCalendarBody.rows) {
                  for (const cell of row) {
                    cell.displayValue += 'xxx';
                  }
                }
                setTimeout(() => {
                  this.calendar.monthView._matCalendarBody._cellClicked(this.calendar.monthView._matCalendarBody.rows[0][0], new MouseEvent('click'));
                }, 1);
                this.isLoading = false;
              },
              error: e => {
                this.toastService.fromError(e);
                this.isLoading = false;
              }
            });
        });
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }

}
