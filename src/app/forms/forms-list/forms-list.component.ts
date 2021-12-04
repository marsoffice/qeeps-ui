import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { FormListFilters } from '../models/form-list-filters';
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

  constructor(private formsService: FormsService, private actRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
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
        console.log(x);
      });
    });
  }

  ngOnDestroy() {
    this._destroy.forEach(x => x.unsubscribe());
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
