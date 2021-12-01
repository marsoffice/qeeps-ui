import { Component, OnInit } from '@angular/core';
import { FormsService } from '../services/forms.service';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {

  constructor(private formsService: FormsService) { }

  ngOnInit(): void {
    this.formsService.getForms().subscribe(x => {
      console.log(x);
    });
  }

}
