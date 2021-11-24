import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrganisationDto } from '../models/organisation.dto';
import { UserDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http: HttpClient) { }

  organisationsTree() {
    return this.http.get<OrganisationDto[]>('/api/access/myOrganisationsTree');
  }

  myProfile() {
    return this.http.get<UserDto>('/api/access/myProfile');
  }
}
