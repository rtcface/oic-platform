import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContralorComponent } from './pages/add-contralor/add-contralor.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';

const routes: Routes = [
  {
    path: '',
    component:AdminHomeComponent,
    children: [
      {
        path: 'add-contralor',
        component: AddContralorComponent
      },
      {
        path: '**',
        redirectTo: 'add-contralor'
      }  
  ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedAdminRoutingModule { }
