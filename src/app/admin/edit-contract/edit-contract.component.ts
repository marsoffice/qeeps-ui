import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DocumentDto } from 'src/app/models/document.dto';
import { AccessService } from 'src/app/services/access.service';
import { ToastService } from 'src/app/shared/toast/services/toast.service';

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.scss']
})
export class EditContractComponent implements OnInit {
  contractForm = new FormGroup({
    id: new FormControl('contract'),
    content: new FormControl()
  });
  constructor(private accessService: AccessService, private toastService: ToastService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.accessService.getDocument('contract').subscribe({
      next: r => {
        this.contractForm.patchValue(r);
      },
      error: e => {
        this.toastService.fromError(e);
      }
    });
  }

  saveContract() {
    const dto: DocumentDto = this.contractForm.value;
    this.accessService.saveDocument(dto).subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.translateService.instant('ui.admin.editContract.contractSavedSuccesfully')
        );
      },
      error: err => {
        this.toastService.fromError(err);
      }
    });
  }

}
