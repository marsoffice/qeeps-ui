import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './forms.component';
import { MyFormsComponent } from './my-forms/my-forms.component';

const routes: Routes = [{ path: '', component: FormsComponent, children: [
  {
    path: '',
    component: MyFormsComponent
  }
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
