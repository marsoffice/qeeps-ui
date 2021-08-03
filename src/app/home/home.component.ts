import { Component, OnInit } from '@angular/core';
import { AccessService } from '../services/access.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  r = '';

  constructor(private accessService: AccessService) { }

  ngOnInit(): void {
  }

  test() {
    this.accessService.myOrganisationsTree().subscribe(x => {
      this.r = JSON.stringify(x);
      console.log(x);
    });
  }
}
