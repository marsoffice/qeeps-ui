import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { FileDto } from '../models/file.dto';
import { FilesService } from '../services/files.service';
import { ErrorsDto } from '../../../models/errors.dto';
import { ErrorDto } from 'src/app/models/error.dto';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent
    }
  ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() multiple = false;
  @Input() accept: string | undefined;
  @Input() required: boolean | undefined;
  @Output('change') change = new EventEmitter<FileDto[]>();
  @ViewChild('upload', { static: true, read: ElementRef }) inputFileRef!: ElementRef<HTMLInputElement>;
  files: FileDto[] = [];
  disabled = false;
  touched = false;
  onChange = (v: any) => { };
  onTouched = () => { };
  constructor(private filesService: FilesService) { }

  ngOnInit(): void {
  }

  showUploadDialog() {
    this.inputFileRef.nativeElement.value = "";
    this.inputFileRef.nativeElement.files = null;
    setTimeout(() => {
      this.inputFileRef.nativeElement.click();
    });
  }

  onFilesSelected() {
    this.markAsTouched();
    const newFiles: FileDto[] = [];
    if (this.files == null) {
      this.files = [];
    }
    for (let i = 0; i < this.inputFileRef.nativeElement.files!.length; i++) {
      const f = this.inputFileRef.nativeElement.files?.item(i);
      if (this.files.some(x => x.filename === f?.name)) {
        continue;
      }
      let dto = {
        filename: f?.name,
        sizeInBytes: f?.size,
        fileRef: f,
        isUploading: true
      } as FileDto;
      newFiles.push(dto);
    }
    this.filesService.upload(newFiles.map(x => x.fileRef!)).subscribe(uploadedFiles => {
      for (const uf of uploadedFiles) {
        const foundFile = newFiles.find(x => x.filename === uf.filename);
        if (foundFile != null) {
          foundFile.fileId = uf.fileId;
          foundFile.userId = uf.userId;
          foundFile.uploadSessionId = uf.uploadSessionId;
          foundFile.location = uf.location;
          foundFile.isUploading = false;
        }
      }
      this.onChange(this.files);
      this.change.emit(this.files);
    }, (e: HttpErrorResponse) => {
      const dto: ErrorsDto = e.error;
      let err: ErrorDto[] = [{
        message: e.error
      }];
      if (dto != null && dto[''] != null) {
        err = dto[''];
      }
      for (const f of newFiles) {
        f.errors = err;
        f.isUploading = false;
      }
      this.onChange(this.files);
    });
    this.files = [...this.files, ...newFiles];
    this.onChange(this.files);
  }

  removeFile(i: number) {
    this.markAsTouched();
    this.files.splice(i, 1);
    this.onChange(this.files);
  }

  writeValue(files: FileDto[]) {
    this.files = files;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const files: FileDto[] = control.value;
    if (files == null || files.length === 0) {
      return null;
    }
    if (files.some(x => x.fileId == null && x.isUploading)) {
      return {
        incomplete: true
      };
    }
    const errors = files.filter(x => x.errors != null).map(x => x.errors);
    if (errors.length > 0) {
      return {
        upload: errors[0]
      };
    }
    return null;
  }
}

