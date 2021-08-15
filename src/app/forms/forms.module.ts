import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { MyFormsComponent } from './my-forms/my-forms.component';
import { SharedModule } from '../shared/shared.module';
import { FormsService } from './services/forms.service';
import { CreateEditFormComponent } from './create-edit-form/create-edit-form.component';


@NgModule({
  declarations: [
    FormsComponent,
    MyFormsComponent,
    CreateEditFormComponent
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
