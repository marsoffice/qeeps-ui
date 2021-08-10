import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrganisationDto } from '../models/organisation.dto';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http: HttpClient) { }

  organisationsTree() {
    return this.http.get<OrganisationDto>('/api/access/myOrganisationsTree');
  }
}
