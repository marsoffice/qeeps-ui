import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoleGuard } from '../services/auth-role.guard';
import { CreateEditFormComponent } from './create-edit-form/create-edit-form.component';
import { FormsListComponent } from './forms-list/forms-list.component';
import { FormsComponent } from './forms.component';

const routes: Routes = [{
  path: '', component: FormsComponent, children: [
    {
      path: '',
      component: FormsListComponent
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
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
