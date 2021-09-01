import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FileDto } from '../models/file.dto';
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() label: string | undefined;
  @Input() multiple = false;
  @Input() accept: string | undefined;
  @ViewChild('upload', { static: true, read: ElementRef }) inputFileRef: ElementRef<HTMLInputElement> | undefined;
  @Input() files: FileDto[] = [];

  @Output() filesChanged = new EventEmitter<FileDto[]>();

  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
  }

  showUploadDialog() {
    this.inputFileRef!.nativeElement.value = "";
    this.inputFileRef!.nativeElement.files = null;
    setTimeout(() => {
      this.inputFileRef!.nativeElement.click();
    });
  }

  onFilesSelected() {
    const newFiles: FileDto[] = [];
    for (let i = 0; i < this.inputFileRef!.nativeElement.files!.length; i++) {

      const f = this.inputFileRef!.nativeElement.files!.item(i);

      if (this.files.some(x => x.filename === f?.name)) {
        continue;
      }

      let dto = {
        filename: f!.name,
        sizeInBytes: f!.size,
        fileRef: f
      } as FileDto;
      newFiles.push(dto);
    }

    this.files = [...this.files, ...newFiles];

    this.filesService.upload(newFiles.map(x => x.fileRef!)).subscribe(uploadedFiles => {
      for (const uf of uploadedFiles) {
        const foundFile = newFiles.find(x => x.filename === uf.filename);
        if (foundFile != null) {
          foundFile.id = uf.id;
          foundFile.userId = uf.userId;
        }
      }
      this.filesChanged.emit(this.files);
    });
  }

  removeFile(i: number) {
    this.files.splice(i, 1);
    this.filesChanged.emit(this.files);
  }
}
