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

  getForms(page?: number, elementsPerPage?: number, startDate?: string, endDate?: string) {
    let url = '/api/forms/getForms';
    const qp: any = {
      page,
      elementsPerPage,
      startDate,
      endDate
    };
    const queryString = Object.keys(qp)
      .map(x => `${x}=${encodeURIComponent(qp[x])}`)
      .join('&');

    if (queryString && queryString.length > 0) {
      url += '?' + queryString;
    }

    return this.http.get<FormDto[]>(url);
  }

  getForm(id: string) {
    return this.http.get<FormDto>(`/api/forms/getForm/${encodeURIComponent(id)}`);
  }
}
