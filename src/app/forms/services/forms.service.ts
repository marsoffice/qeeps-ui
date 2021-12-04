import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormListFilters } from '../models/form-list-filters';
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

  getForms(filtersObject?: FormListFilters) {
    let url = '/api/forms/getForms';
    const filters: any = filtersObject == null ? {} : filtersObject;
    const queryString = Object.keys(filters)
      .filter(k => filters[k] != null)
      .map(x => `${x}=${encodeURIComponent(filters[x])}`)
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
