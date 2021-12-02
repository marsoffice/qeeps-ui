import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ConfirmationData } from '../models/confirmation-data';
@Injectable()
export class ConfirmationService {

  constructor(private matDialog: MatDialog) { }

  confirm(message: string) {
    const dialogRef = this.matDialog.open(ConfirmationComponent, {
      data: {
        message
      } as ConfirmationData
    });
    return dialogRef.afterClosed().pipe(
      map(x => {
        if (x == null || x === false) {
          return false;
        }
        return true;
      })
    );
  }
}
