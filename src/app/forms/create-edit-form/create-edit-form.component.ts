import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-edit-form',
  templateUrl: './create-edit-form.component.html',
  styleUrls: ['./create-edit-form.component.scss']
})
export class CreateEditFormComponent implements OnInit {
  form: FormGroup;
  columns: FormArray;
  rows: FormArray;
  id: string | null = null;

  constructor(private actRoute: ActivatedRoute) {
    this.columns = new FormArray([]);
    this.rows = new FormArray([]);

    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      description: new FormControl(),
      attachments: new FormControl([]),
      isLocked: new FormControl(false),
      lockedUntilDate: new FormControl(),
      rowAppendDisabled: new FormControl(false),
      isRecurrent: new FormControl(false),
      cronExpression: new FormControl(),
      isPinned: new FormControl(false),
      pinnedUntilDate: new FormControl(),
      tags: new FormControl([]),
      columns: this.columns,
      rows: this.rows,
      formAccesses: new FormControl([])
    });
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params => {
      this.id = params.id;

    });
  }

  save() {
    console.log(this.form.value);
  }
}
