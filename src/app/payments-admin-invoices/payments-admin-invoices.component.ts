import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { PaymentsAdminInvoiceAddComponent } from '../payments-admin-invoice-add/payments-admin-invoice-add.component';
import { PaymentsAdminInvoiceDetalisComponent } from '../payments-admin-invoice-detalis/payments-admin-invoice-detalis.component';

@Component({
  selector: 'app-payments-admin-invoices',
  templateUrl: './payments-admin-invoices.component.html',
  styleUrls: ['./payments-admin-invoices.component.scss']
})
export class PaymentsAdminInvoicesComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  clickdetalis(){
    this.dialog.open(PaymentsAdminInvoiceDetalisComponent, {
      panelClass: 'my-dialog'

    })

  }

  clickmanualInvoice(){
    this.dialog.open(PaymentsAdminInvoiceAddComponent, {
      panelClass: 'my-dialog'

    })

  }

  clickgenerate(){
    this.dialog.open(PaymentsAdminInvoiceAddComponent, {
      panelClass: 'my-dialog'

    })

  }


}
