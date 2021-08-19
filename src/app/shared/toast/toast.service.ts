import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastData } from './toast/toast-data';
import { ToastComponent } from './toast/toast.component';

@Injectable()
export class ToastService {

  constructor(private snackBar: MatSnackBar) { }

  showError(message: string, title: string) {
    return this.show(message, title, 'severity-error');
  }

  showInfo(message: string, title: string) {
    return this.show(message, title, 'severity-info');
  }

  showWarn(message: string, title: string) {
    return this.show(message, title, 'severity-warn');
  }

  showSuccess(message: string, title: string) {
    return this.show(message, title, 'severity-success');
  }

  private show(message: string, title: string, className: string) {
    const sub = new Subject<void>();
    this.snackBar.openFromComponent(ToastComponent, {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: environment.toastDuration,
      panelClass: className,
      data: {
        message: message,
        title: title,
        className: className,
        onClick: () => {
          sub.next();
        }
      } as ToastData
    });
    return sub.asObservable();
  }
}
