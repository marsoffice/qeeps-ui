import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap, tap } from 'rxjs';
import { OrganisationDto } from '../models/organisation.dto';
import { UserDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private userProfileSubject = new BehaviorSubject<UserDto | undefined>(undefined);

  constructor(private http: HttpClient) { }

  organisationsTree() {
    return this.http.get<OrganisationDto[]>('/api/access/myOrganisationsTree');
  }

  myProfile() {
    return this.userProfileSubject.asObservable().pipe(
      switchMap(x => {
        if (!x) {
          return this.http.get<UserDto>('/api/access/myProfile').pipe(
            tap(x => {
              this.userProfileSubject.next(x);
            })
          );
        }
        return of(x);
      })
    );
  }

  updateMyProfile(payload: UserDto) {
    return this.http.put('/api/access/myProfile', payload).pipe(
      tap(() => {
        this.userProfileSubject.next(payload);
      })
    );
  }
}
