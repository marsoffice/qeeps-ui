import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrganisationDto } from '../models/organisation.dto';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private organisationsTreeSubject = new BehaviorSubject<OrganisationDto | null>(null);

  constructor(private http: HttpClient) { }

  loadOrganisationsTree() {
    this.http.get<OrganisationDto>('/api/access/myOrganisationsTree').subscribe(o => {
      this.organisationsTreeSubject.next(o);
    }, () => {
      this.organisationsTreeSubject.next(null);
    });
  }

  clearOrganisationsTree() {
    this.organisationsTreeSubject.next(null);
  }

  organisationTree() {
    return this.organisationsTreeSubject.asObservable();
  }
}
