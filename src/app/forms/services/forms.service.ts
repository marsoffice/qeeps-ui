import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FormsService {

  constructor(private http: HttpClient) { }

  test() {
    return this.http.get<any>('/api/forms/test');
  }
}
