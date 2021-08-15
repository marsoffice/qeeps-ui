import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserPreferencesDto } from '../models/user-preferences.dto';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private userPreferencesSubject = new BehaviorSubject<UserPreferencesDto>({
    preferredLanguage: 'ro',
    useDarkTheme: false
  });
  constructor(private http: HttpClient) {
    this.http.get<UserPreferencesDto>(`/api/access/userPreferences`).subscribe(x => {
      if (x == null) {
        return;
      }
      this.userPreferencesSubject.next(x);
    });
  }

  get userPreferences() {
    return this.userPreferencesSubject.asObservable();
  }

  saveUserPreferences(model: UserPreferencesDto) {
    return this.http.post(`/api/access/userPreferences`, model).pipe(
      tap(() => {
        this.userPreferencesSubject.next(model);
      })
    );
  }
}
