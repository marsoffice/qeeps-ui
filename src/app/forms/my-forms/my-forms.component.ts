import { Component, OnInit } from '@angular/core';
import { FormsService } from '../services/forms.service';

@Component({
  selector: 'app-my-forms',
  templateUrl: './my-forms.component.html',
  styleUrls: ['./my-forms.component.scss']
})
export class MyFormsComponent implements OnInit {

  constructor(private formsService: FormsService) { }

  ngOnInit(): void {
    this.formsService.test().subscribe(x => {
      console.log(x);
    });
  }

}
