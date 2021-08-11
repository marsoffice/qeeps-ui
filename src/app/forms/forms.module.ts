import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { MyFormsComponent } from './my-forms/my-forms.component';
import { SharedModule } from '../shared/shared.module';
import { FormsService } from './services/forms.service';


@NgModule({
  declarations: [
    FormsComponent,
    MyFormsComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    SharedModule
  ],
  providers: [
    FormsService
  ]
})
export class FormsModule { }
