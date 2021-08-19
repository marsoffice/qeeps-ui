import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserPreferencesDto } from '../models/user-preferences.dto';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private userPreferencesSubject: BehaviorSubject<UserPreferencesDto>;
  constructor(private http: HttpClient) {
    let upObj: UserPreferencesDto = {
      preferredLanguage: 'ro',
      useDarkTheme: false
    };
    const upLs = localStorage.getItem('user_preferences');
    if (upLs != null) {
      upObj = JSON.parse(upLs) as UserPreferencesDto;
    }
    this.userPreferencesSubject = new BehaviorSubject<UserPreferencesDto>(upObj);
    this.http.get<UserPreferencesDto>(`/api/access/userPreferences`).subscribe(x => {
      if (x == null) {
        return;
      }
      if (upLs == null) {
        localStorage.setItem('user_preferences', JSON.stringify(x));
      }
      const old = this.userPreferencesSubject.value;
      if (x?.preferredLanguage !== old?.preferredLanguage || x?.useDarkTheme !== old?.useDarkTheme) {
        this.userPreferencesSubject.next(x);
      }
    });
  }

  get userPreferences() {
    return this.userPreferencesSubject.asObservable();
  }

  saveUserPreferences(model: UserPreferencesDto) {
    this.userPreferencesSubject.next(model);
    localStorage.setItem('user_preferences', JSON.stringify(model));
    return this.http.post(`/api/access/userPreferences`, model);
  }
}
