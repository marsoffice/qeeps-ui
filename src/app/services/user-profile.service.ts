import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, of, switchMap, tap } from 'rxjs';
import { UserDto } from '../models/user.dto';
import { AccessService } from './access.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private subject = new BehaviorSubject<UserDto | undefined>(undefined);
  constructor(private accessService: AccessService) { }

  get profile() {
    return this.subject.asObservable().pipe(
      switchMap(x => {
        if (x === undefined) {
          return this.accessService.myProfile().pipe(
            tap(x => {
              if (this.subject.value === undefined) {
                this.subject.next(x);
              }
            })
          );
        }
        return of(x);
      }),
      filter(x => x != null)
    );
  }

  setContractSigned(value: boolean) {
    if (!this.subject.value) {
      return;
    }
    this.subject.next({ ...this.subject.value, hasSignedContract: value });
  }
}
