import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Claims } from '../models/claims';
import { AccessService } from '../services/access.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy {
  @ViewChild('sign', { static: false }) signatureComponent: SignaturePadComponent | undefined;
  contractHtml: string | undefined;
  signatureOptions: NgSignaturePadOptions = {
    canvasHeight: 100,
    canvasWidth: 0
  };
  today = new Date();
  user: Claims | undefined;
  private _destroy: Subscription[] = [];

  constructor(private accessService: AccessService, private toastService: ToastService,
    private authService: AuthService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.accessService.getDocument('contract').subscribe({
      next: doc => {
        this.contractHtml = doc.content;
      },
      error: e => {
        this.toastService.fromError(e);
      }
    });

    this._destroy.push(
      this.authService.user.subscribe(u => {
        this.user = u;
      })
    );
  }

  ngOnDestroy() {
    this._destroy.forEach(x => x.unsubscribe());
  }

  get signatureIsEmpty() {
    if (this.signatureComponent == null) {
      return true;
    }
    return this.signatureComponent!.isEmpty();
  }

  saveSignedContract() {
    const img = this.signatureComponent!.toDataURL();
    this.accessService.acceptContract({ signatureImage: img }).subscribe({
      next: () => {
        this.toastService.showSuccess(this.translateService.instant('ui.contract.contractSigned'));
      },
      error: e => {
        this.toastService.fromError(e);
      }
    });
  }
}
