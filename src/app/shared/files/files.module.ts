import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesService } from './services/files.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    TranslateModule,
    MatInputModule,
    FlexLayoutModule,
    MatListModule,
    MatProgressBarModule
  ],
  exports: [
    FileUploadComponent
  ],
  providers: [
    FilesService
  ]
})
export class FilesModule { }
