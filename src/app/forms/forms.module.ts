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
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTreeModule } from '@angular/material/tree';
import { CellComponent } from './cells/cell/cell.component';
import { StringCellComponent } from './cells/string-cell/string-cell.component';
import { MatCardModule } from '@angular/material/card';
import { NumberCellComponent } from './cells/number-cell/number-cell.component';
import { DateTimeCellComponent } from './cells/date-time-cell/date-time-cell.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BooleanCellComponent } from './cells/boolean-cell/boolean-cell.component';
import { FilesCellComponent } from './cells/files-cell/files-cell.component';
import { DateCellComponent } from './cells/date-cell/date-cell.component';
import { MatNativeDateModule } from '@angular/material/core';
import { DropdownCellComponent } from './cells/dropdown-cell/dropdown-cell.component';
import { CronModule } from '../shared/cron/cron.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    FormsComponent,
    MyFormsComponent,
    CreateEditFormComponent,
    CellComponent,
    StringCellComponent,
    NumberCellComponent,
    DateTimeCellComponent,
    BooleanCellComponent,
    FilesCellComponent,
    DateCellComponent,
    DropdownCellComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    FilesModule,
    MatChipsModule,
    MatSlideToggleModule,
    DragDropModule,
    MatTooltipModule,
    MatCardModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    FilesModule,
    MatNativeDateModule,
    CronModule,
    MatTreeModule,
    MatCheckboxModule
  ],
  providers: [
    FormsService
  ]
})
export class FormsModule { }
