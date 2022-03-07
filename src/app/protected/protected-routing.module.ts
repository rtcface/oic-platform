import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmHomeComponent } from './pages/adm-home/adm-home.component';
import { AdmKpisComponent } from './pages/adm-kpis/adm-kpis.component';
import { AdmUsersComponent } from './pages/adm-users/adm-users.component';
import { AdmWorkplanComponent } from './pages/adm-workplan/adm-workplan.component';

const routes: Routes = [
  {
    path: '',
    component:AdmHomeComponent,
    children: [
      {
        path: 'adm-workplan',
        component: AdmWorkplanComponent
      },
      {
        path: 'adm-users',
        component: AdmUsersComponent
      },
      {
        path:'adm-kpis',
        component: AdmKpisComponent
      },
      {
        path: '**',
        redirectTo: 'adm-workplan'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
