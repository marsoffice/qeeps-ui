import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, first, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(appRef: ApplicationRef, updates: SwUpdate) {
    if (!updates.isEnabled) {
      console.log('PWA SW not available');
      return;
    }
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everyOneHour$ = interval(60 * 60 * 1000);
    const everyOneHourOnceAppIsStable$ = concat(appIsStable$, everyOneHour$);

    updates.unrecoverable.subscribe(() => {
      window.location.reload();
    });

    updates.versionUpdates.subscribe(vu => {
      if (vu.type === 'VERSION_INSTALLATION_FAILED') {
        console.error('PWA update error', vu.error);
        window.location.reload();
        return;
      }
      if (vu.type === 'VERSION_DETECTED') {
        console.log('New version detected', vu.version);
        return;
      }
      if (vu.type === 'VERSION_READY') {
        console.log('PWA new version is ready, replacing versions old with new', vu.currentVersion, vu.latestVersion);
        updates.activateUpdate().then(() => {
          window.location.reload();
        });
        return;
      }
    });

    everyOneHourOnceAppIsStable$.subscribe(() => updates.checkForUpdate());

    updates.checkForUpdate();
  }
}
