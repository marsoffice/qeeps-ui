import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ErrorDto } from '../models/error.dto';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  tryAddFormErrorsFromHttpError(error: HttpErrorResponse, form: AbstractControl) {
    const errorResponse = error.error;
    if (errorResponse == null) {
      form.setErrors({
        backend: [
          {
            message: errorResponse.toString(),
            placeholderValues: {}
          }
        ]
      });
      return;
    }
    if (typeof (errorResponse) !== 'object') {
      form.setErrors({
        backend: [
          {
            message: errorResponse.toString(),
            placeholderValues: {}
          }
        ]
      });
      return;
    }
    const errors = errorResponse as { [key: string]: ErrorDto[]; };
    const keys = Object.keys(errors);

    for (const key of keys) {
      let control = this.searchControl(key, form);
      if (control == null) {
        continue;
      }
      control.setErrors({
        backend: errors[key]
      });
    }
  }

  private searchControl(key: string, form: AbstractControl) {
    if (key === '') {
      return form;
    }
    const splitByDot = key.split('.').map(x => this.toPascalCase(x));
    let foundControl: AbstractControl = form;
    for (const path of splitByDot) {
      const ctl = foundControl.get(path);
      if (ctl == null) {
        return null;
      }
      foundControl = ctl;
    }
    return foundControl;
  }

  private toPascalCase(s: string) {
    if (s == null || s.length === 0) {
      return s;
    }
    return s.charAt(0).toLowerCase() + s.substring(1);
  }
}
