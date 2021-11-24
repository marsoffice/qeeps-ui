import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {

  constructor(public bs: MatBottomSheetRef<LegalComponent>) { }

  ngOnInit(): void {
  }

  clickAccept(){
    localStorage.setItem('accepted', 'true')
    this.bs.dismiss()

  }

  clickReject(){
    location.href = "https://google.com"
  }

}
