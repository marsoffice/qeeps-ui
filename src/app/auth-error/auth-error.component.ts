import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-error',
  templateUrl: './auth-error.component.html',
  styleUrls: ['./auth-error.component.scss']
})
export class AuthErrorComponent implements OnInit {
  errors: string[] | null = null;
  constructor() { }

  ngOnInit(): void {
    this.errors = AuthService.logStore;
  }

}
