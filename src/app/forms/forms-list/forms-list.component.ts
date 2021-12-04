import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
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
  });

  private _destroy: Subscription[] = [];

  displayedColumns: string[] = ['title', 'createdDate', 'tags'];
  dataSource = new MatTableDataSource<FormDto>([]);
  total = 0;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  isMobile = false;

  constructor(private formsService: FormsService, private actRoute: ActivatedRoute, private router: Router,
    private mediaObserver: MediaObserver) { }

  ngOnInit(): void {
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
        endDate: qp["endDate"] || null
      };
      this.filters.setValue(queryValues);
      this.formsService.getForms(this.filters.value).subscribe(x => {
        this.dataSource.data = x.forms;
        this.total = x.total;
      });
    });
  }

  ngOnDestroy() {
    this._destroy.forEach(x => x.unsubscribe());
  }

  onPaginatorChanged(event: PageEvent) {
    if (event.pageSize !== this.filters.value.elementsPerPage || event.pageIndex !== this.filters.value.page) {
      this.filters.patchValue({
        elementsPerPage: event.pageSize,
        page: event.pageIndex
      });
    }
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
