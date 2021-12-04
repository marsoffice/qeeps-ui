import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, mapTo, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[matTableResponsive]'
})
export class MatTableResponsiveDirective
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  private thead!: HTMLTableSectionElement;
  private tbody!: HTMLTableSectionElement;

  private theadChanged$ = new BehaviorSubject(true);
  private tbodyChanged$ = new Subject<boolean>();

  private theadObserver = new MutationObserver(() =>
    this.theadChanged$.next(true)
  );
  private tbodyObserver = new MutationObserver(() =>
    this.tbodyChanged$.next(true)
  );

  constructor(private table: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.thead = this.table.nativeElement.querySelector('thead');
    this.tbody = this.table.nativeElement.querySelector('tbody');

    this.theadObserver.observe(this.thead, {
      characterData: true,
      subtree: true
    });
    this.tbodyObserver.observe(this.tbody, { childList: true });
  }

  ngAfterViewInit() {
    /**
     * Set the "data-column-name" attribute for every body row cell, either on
     * thead row changes (e.g. language changes) or tbody rows changes (add, delete).
     */
    combineLatest([this.theadChanged$, this.tbodyChanged$])
      .pipe(
        map(
          () => ({
            colNames: [...(this.thead.rows!.item(0)!.children as any)].map(headerCell => headerCell.textContent as string),
            rows: [...(this.tbody.rows as any)].map(row => [...row.children] as any)
          })
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe((x) => {
        x.rows.forEach(rowCells =>
          rowCells.forEach((cell: any) =>
            this.renderer.setAttribute(
              cell,
              'data-column-name',
              x.colNames[cell.cellIndex]
            )
          )
        );
      }
      );
  }

  ngOnDestroy(): void {
    this.theadObserver.disconnect();
    this.tbodyObserver.disconnect();

    this.onDestroy$.next(true);
  }
}
