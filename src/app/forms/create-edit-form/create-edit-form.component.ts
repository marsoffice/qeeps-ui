import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-create-edit-form',
  templateUrl: './create-edit-form.component.html',
  styleUrls: ['./create-edit-form.component.scss']
})
export class CreateEditFormComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    description: new FormControl(),
    attachments: new FormControl([]),
    isLocked: new FormControl(false),
    lockedUntilDate: new FormControl(),
    rowAppendDisabled: new FormControl(false),
    isRecurrent: new FormControl(false),

  });
  constructor() { }

  ngOnInit(): void {
  }

}
