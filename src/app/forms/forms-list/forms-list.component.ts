import { MatDatetimePickerInputEvent, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';
import { Claims } from 'src/app/models/claims';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService } from 'src/app/shared/confirmation/services/confirmation.service';
import { ToastService } from 'src/app/shared/toast/services/toast.service';
import { FormListFilters } from '../models/form-list-filters';
import { FormDto } from '../models/form.dto';
import { FormsService } from '../services/forms.service';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit, OnDestroy {
  filters = new FormGroup({
    page: new FormControl(),
    elementsPerPage: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    tags: new FormControl(),
    search: new FormControl(),
    sortBy: new FormControl(),
    sortOrder: new FormControl()
  });

  readonly separatorKeysCodes = [ENTER, COMMA, TAB] as const;

  searchForm = new FormGroup({
    text: new FormControl()
  });

  startDate: Date | undefined;
  endDate: Date | undefined;

  tags: string[] = [];

  private _destroy: Subscription[] = [];

  displayedColumns: string[] = ['title', 'userName', 'createdDate', 'deadline', 'tags', 'edit', 'delete'];
  dataSource = new MatTableDataSource<FormDto>([]);
  total = 0;
  user: Claims | null = null;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  isMobile = false;

  constructor(private formsService: FormsService, private actRoute: ActivatedRoute, private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private dateAdapter: DateAdapter<any>,
    private ngxDateAdapter: NgxMatDateAdapter<any>,
    private translateService: TranslateService,
    private toastService: ToastService,
    private mediaObserver: MediaObserver) { }

  ngOnInit(): void {
    this._destroy.push(
      this.authService.user.subscribe(u => {
        this.user = u;
      })
    );

    this._destroy.push(
      this.translateService.onLangChange.subscribe(() => {
        this.dateAdapter.setLocale(this.translateService.currentLang);
        this.ngxDateAdapter.setLocale(this.translateService.currentLang);
      })
    );

    this._destroy.push(
      this.mediaObserver.asObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isActive('xs');
      })
    );

    this._destroy.push(
      this.filters.valueChanges.subscribe(v => {
        this.updateQueryParams();
      })
    );
    this.actRoute.queryParams.subscribe(qp => {
      const queryValues: FormListFilters = {
        page: !qp["page"] ? 0 : +qp["page"],
        elementsPerPage: !qp["elementsPerPage"] ? 50 : +qp["elementsPerPage"],
        startDate: qp["startDate"] || null,
        endDate: qp["endDate"] || null,
        search: qp["search"] || null,
        sortBy: qp["sortBy"] || null,
        sortOrder: qp["sortOrder"] || null,
        tags: qp["tags"] || null
      };
      this.filters.setValue(queryValues);
      this.searchForm.setValue({ text: queryValues.search });

      if (queryValues.startDate != null) {
        this.startDate = new Date(Date.parse(queryValues.startDate));
      }
      if (queryValues.endDate != null) {
        this.endDate = new Date(Date.parse(queryValues.endDate));
      }

      if (queryValues.tags != null && queryValues.tags.length > 0) {
        this.tags = queryValues.tags.split(',');
      }

      this.executeLoad();

    });
  }

  onStartDateChanged(e: MatDatetimePickerInputEvent<Date>) {
    this.startDate = !e.value ? undefined : e.value!;
    if (this.startDate) {
      this.filters.setValue({ ...this.filters.value, startDate: this.startDate.toISOString() });
    } else {
      this.filters.setValue({ ...this.filters.value, startDate: null });
    }
  }

  onEndDateChanged(e: MatDatetimePickerInputEvent<Date>) {
    this.endDate = !e.value ? undefined : e.value!;
    if (this.endDate) {
      this.filters.setValue({ ...this.filters.value, endDate: this.endDate.toISOString() });
    } else {
      this.filters.setValue({ ...this.filters.value, endDate: null });
    }
  }

  onStartDateReset() {
    this.startDate = undefined;
    this.filters.setValue({ ...this.filters.value, startDate: null });
  }

  onEndDateReset() {
    this.endDate = undefined;
    this.filters.setValue({ ...this.filters.value, endDate: null });
  }

  onSearchSubmit() {
    if (this.searchForm.value.text == null || this.searchForm.value.text.length === 0) {
      return;
    }
    this.filters.controls.search.setValue(this.searchForm.value.text);
  }

  castToAny(x: any) {
    return x as any;
  }

  clearSearch() {
    this.searchForm.setValue({ text: null });
    this.filters.setValue({ ...this.filters.value, search: null });
  }

  removeTag(i: number) {
    this.tags.splice(i, 1);
    this.filters.setValue({ ...this.filters.value, tags: this.tags.join() });
  }

  addTag(event: MatChipInputEvent): void {
    const value: string = (event.value || '').trim();

    if (value) {
      if (this.tags.indexOf(value) === -1) {
        this.tags.push(value);
        this.filters.setValue({ ...this.filters.value, tags: this.tags.join() });
      }
    }
    event.chipInput!.clear();
  }
  private executeLoad() {
    this.dataSource.data = [];
    const formFilters: FormListFilters = this.filters.value;
    this.formsService.getForms(formFilters).subscribe(x => {
      x.forms.forEach(f => {
        f.isPinned = false;
        f.pinnedUntilDate = undefined;
      });
      this.dataSource.data = [...this.dataSource.data, ...x.forms];
      this.total = x.total;
    });

    if (formFilters.endDate == null && formFilters.startDate == null && formFilters.page === 0) {
      this.formsService.getPinnedForms().subscribe(x => {
        x.forEach(f => {
          f.isPinned = true;
        });
        this.dataSource.data = [...x, ...this.dataSource.data];
      });
    }
  }

  ngOnDestroy() {
    this._destroy.forEach(x => x.unsubscribe());
  }

  onPaginatorChanged(event: PageEvent) {
    if (event.pageSize !== this.filters.value.elementsPerPage || event.pageIndex !== this.filters.value.page) {
      this.filters.setValue({
        ...this.filters.value,
        elementsPerPage: event.pageSize,
        page: event.pageIndex
      });
    }
  }

  deleteForm(form: FormDto) {
    this.confirmationService.confirm().subscribe(x => {
      if (!x) {
        return;
      }
      this.formsService.deleteForm(form.id).subscribe({
        next: () => {
          this.toastService.showSuccess(
            this.translateService.instant('ui.forms.formsList.formDeleted')
          );
          this.executeLoad();
        },
        error: e => {
          this.toastService.fromError(e);
        }
      });
    });
  }

  onSortChanged(event: Sort) {
    this.filters.setValue({
      ...this.filters.value,
      sortBy: event.direction === '' ? null : event.active,
      sortOrder: event.direction == '' ? null : event.direction
    });
  }

  private updateQueryParams() {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: this.filters.value,
      relativeTo: this.actRoute,
      replaceUrl: true
    });
  }
}
