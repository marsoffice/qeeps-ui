import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  r = '';

  constructor(private testService: TestService) { }

  ngOnInit(): void {
  }

  test() {
    this.testService.test().subscribe(x => {
      this.r = JSON.stringify(x)
    });
  }
}
