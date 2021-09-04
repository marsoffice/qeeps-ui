import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { MyFormsComponent } from './my-forms/my-forms.component';
import { SharedModule } from '../shared/shared.module';
import { FormsService } from './services/forms.service';
import { CreateEditFormComponent } from './create-edit-form/create-edit-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FilesModule } from '../shared/files/files.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    FormsComponent,
    MyFormsComponent,
    CreateEditFormComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    FilesModule,
    MatChipsModule,
    MatSlideToggleModule
  ],
  providers: [
    FormsService
  ]
})
export class FormsModule { }
