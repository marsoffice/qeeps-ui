import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormDto } from '../models/form.dto';

@Injectable()
export class FormsService {

  constructor(private http: HttpClient) { }

  create(dto: FormDto) {
    return this.http.post<FormDto>('/api/forms/create', dto);
  }

  update(id: string, dto: FormDto) {
    return this.http.put<FormDto>('/api/forms/update/' + id, dto);
  }
}
