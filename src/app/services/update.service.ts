import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(public updates: SwUpdate) {
    if (updates.isEnabled) {
      updates.checkForUpdate().then(() => console.log('initial update check'));
      interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
        .then(() => console.log('checking for updates')));
    }
  }

  public checkForUpdates(): void {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => this.promptUser());
    }
  }

  private promptUser(): void {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
