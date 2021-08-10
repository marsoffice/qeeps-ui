import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsAdminPriceAddComponent } from '../payments-admin-price-add/payments-admin-price-add.component';

@Component({
  selector: 'app-payments-admin-prices',
  templateUrl: './payments-admin-prices.component.html',
  styleUrls: ['./payments-admin-prices.component.scss']
})
export class PaymentsAdminPricesComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(){

    this.dialog.open(PaymentsAdminPriceAddComponent, {
      panelClass: 'my-dialog'
    })

  }

}
