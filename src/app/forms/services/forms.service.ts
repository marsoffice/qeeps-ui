import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateEditFormDto } from '../models/create-edit-form.dto';
import { FormDto } from '../models/form.dto';

@Injectable()
export class FormsService {

  constructor(private http: HttpClient) { }

  create(dto: CreateEditFormDto) {
    return this.http.post<FormDto>('/api/forms/create', dto);
  }

  update(id: string, dto: CreateEditFormDto) {
    return this.http.put<FormDto>('/api/forms/update/' + id, dto);
  }
}
