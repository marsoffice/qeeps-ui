import { Component, OnInit } from '@angular/core';
import { AccessService } from '../services/access.service';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  contractHtml: string | undefined;

  constructor(private accessService: AccessService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.accessService.getDocument('contract').subscribe({
      next: doc => {
        this.contractHtml = doc.content;
      },
      error: e => {
        this.toastService.fromError(e);
      }
    });
  }

}
