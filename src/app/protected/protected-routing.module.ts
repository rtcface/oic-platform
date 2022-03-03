import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmWorkplanComponent } from './pages/adm-workplan/adm-workplan.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'adm-workplan',
        component: AdmWorkplanComponent
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
