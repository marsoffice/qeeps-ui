import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
        tags: qp["tags"] == null ? null : qp["tags"].split(',')
      };
      this.filters.setValue(queryValues);
      this.dataSource.data = [];

      this.executeLoad();

    });
  }

  private executeLoad() {
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
    console.log(this.filters.value);
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
