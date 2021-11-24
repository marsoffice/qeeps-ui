import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LegalComponent } from '../legal/legal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public bottomS: MatBottomSheet) { }

  ngOnInit(): void {
    const valoareLocalStorage = localStorage.getItem('accepted')
    if (valoareLocalStorage == null){
      this.bottomS.open(LegalComponent);
    }
   
  }

}
