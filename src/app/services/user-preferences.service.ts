import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    this.userPreferencesSubject.next(model);
    return this.http.post(`/api/access/userPreferences`, model);
  }
}
