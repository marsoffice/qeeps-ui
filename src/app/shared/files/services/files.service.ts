import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileDto } from '../models/file.dto';

@Injectable()
export class FilesService {

  constructor(private http: HttpClient) { }

  upload(files: File[]) {
    const fd = new FormData();
    for (const f of files) {
      fd.append('files', f);
    }
    return this.http.post<FileDto[]>(`/api/files/upload`, fd);
  }
}
