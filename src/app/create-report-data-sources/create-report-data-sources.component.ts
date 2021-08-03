import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateReportDataSourceAddComponent } from '../create-report-data-source-add/create-report-data-source-add.component';

@Component({
  selector: 'app-create-report-data-sources',
  templateUrl: './create-report-data-sources.component.html',
  styleUrls: ['./create-report-data-sources.component.scss']
})
export class CreateReportDataSourcesComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(){
    this.dialog.open(CreateReportDataSourceAddComponent, {
      panelClass: 'my-dialog'
    })

  }

}
