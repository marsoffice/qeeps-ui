import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private testService: TestService) { }

  ngOnInit(): void {
  }

  test() {
    this.testService.test().subscribe(x => {
      console.log(x);
    });
  }
}
