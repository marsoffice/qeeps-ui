import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableResponsiveDirective } from './mat-table-responsive.directive';



@NgModule({
  declarations: [
    MatTableResponsiveDirective
  ],
  exports: [
    MatTableResponsiveDirective
  ]
})
export class MatTableResponsiveModule { }
