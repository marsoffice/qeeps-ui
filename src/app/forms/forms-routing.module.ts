import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoleGuard } from '../services/auth-role.guard';
import { CreateEditFormComponent } from './create-edit-form/create-edit-form.component';
import { FormsComponent } from './forms.component';
import { MyFormsComponent } from './my-forms/my-forms.component';

const routes: Routes = [{ path: '', component: FormsComponent, children: [
  {
    path: '',
    component: MyFormsComponent
  },
  {
    path: 'create',
    component: CreateEditFormComponent,
    canActivate: [AuthRoleGuard],
    data: {
      roles: ["Admin", "Owner"]
    }
  },
  {
    path: 'edit/:id',
    component: CreateEditFormComponent,
    canActivate: [AuthRoleGuard],
    data: {
      roles: ["Admin", "Owner"]
    }
  }
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
