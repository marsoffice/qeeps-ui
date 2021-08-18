import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) { }

  showError(message: string) {
    return this.show(message, 'severity-error');
  }

  showInfo(message: string) {
    return this.show(message, 'severity-info');
  }

  showWarn(message: string) {
    return this.show(message, 'severity-warn');
  }

  showSuccess(message: string) {
    return this.show(message, 'severity-success');
  }

  private show(message: string, className: string) {
    return this.snackBar.open(message, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: environment.toastDuration,
      panelClass: className,
    });
  }
}
