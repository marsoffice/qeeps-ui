import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar, MatCalendarCell } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToastService } from 'src/app/shared/toast/services/toast.service';
import { FormListFilters } from '../models/form-list-filters';
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
  isLoading = true;
  initialLoaded = false;

  @ViewChild('calendar', { static: true }) calendar!: MatCalendar<any>;

  constructor(private formsService: FormsService,
    private translateService: TranslateService,
    private stateService: StateService,
    private toastService: ToastService,
    private router: Router,
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
          this.formsService.getForms({
            startDate: this.startDate.toISOString(),
            endDate: this.endDate.toISOString()
          }).subscribe({
            next: x => {
              this.forms = x.forms;
              for (const row of this.calendar.monthView._matCalendarBody.rows) {
                for (const cell of row) {
                  cell.ariaLabel = '';
                  const leftDate = (cell.rawValue as Date);
                  const rightDate = new Date(leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate() + 1);
                  const noOfForms = this.forms.filter(f => {
                    const formLocalDate = new Date(Date.parse(f.createdDate));
                    return leftDate <= formLocalDate && rightDate > formLocalDate;
                  }).length;
                  cell.displayValue = cell.value.toString();
                  const classes: any = {
                    calcell: true
                  };
                  if (noOfForms > 0) {
                    cell.displayValue += ` (${noOfForms})`;
                    classes[this.getCssClass(noOfForms)] = true;
                  } else {
                    classes['disabled'] = true;
                    cell.displayValue = cell.displayValue;
                  }
                  cell.cssClasses = classes;
                }
              }
              setTimeout(() => {
                try {
                  this.calendar.monthView._matCalendarBody.selectedValueChange.emit({ value: 1, event: new MouseEvent('click') });
                  this.isLoading = false;
                } catch (err) {
                  // ignored
                  this.isLoading = false;
                }
              });
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

  onDaySelect(date: Date) {
    if (this.isLoading) {
      return;
    }
    const prevDayDate = date.toISOString();
    const nextDayDate = new Date(date.getTime());
    nextDayDate.setDate(nextDayDate.getDate() + 1);
    const filters: FormListFilters = {
      startDate: prevDayDate,
      endDate: nextDayDate.toISOString(),
      page: 0,
      elementsPerPage: 50,
      sortBy: 'createdDate',
      sortOrder: 'desc'
    };
    this.router.navigate(['/forms/forms-list'], {
      queryParams: {
        ...filters
      }
    });
  }

  private getCssClass(no: number) {
    if (no <= 5) {
      return 'green';
    }
    if (no > 5 && no <= 10) {
      return 'orange';
    }
    return 'red';
  }

}
