import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-report-filtering-grouping',
  templateUrl: './create-report-filtering-grouping.component.html',
  styleUrls: ['./create-report-filtering-grouping.component.scss']
})
export class CreateReportFilteringGroupingComponent implements OnInit {

  cards = [
    {
      fisier: 'asdasdasd fisier',
      coloana: 'coloana 1 1 1 11 1111',
      vizibil: true,
      group: true,
    },
    {
      fisier: 'asdasdasd fisier',
      coloana: 'coloana 1 12222 1 11 1111',
      vizibil: true,
      group: false,
    },
    {
      fisier: 'asdasdasd fisier',
      coloana: 'coloana 1 13333 1 11 1111',
      vizibil: true,
      group: false,
    },
    {
      fisier: 'asdasdasd fisier',
      coloana: 'coloana 1 1444 1 11 1111',
      vizibil: true,
      group: false,
    },
    {
      fisier: 'asdasdasd fisier',
      coloana: 'coloana 1 1 1 155551 1111',
      vizibil: false,
      group: false,
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

}
