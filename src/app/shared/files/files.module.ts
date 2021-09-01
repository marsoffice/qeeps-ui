import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesService } from './services/files.service';
import { FileUploadComponent } from './file-upload/file-upload.component';



@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FileUploadComponent
  ],
  providers: [
    FilesService
  ]
})
export class FilesModule { }
