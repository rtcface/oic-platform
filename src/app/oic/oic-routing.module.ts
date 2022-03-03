import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmWorkplanComponent } from '../protected/pages/adm-workplan/adm-workplan.component';
import { DatosGeneralesComponent } from './pages/datos-generales/datos-generales.component';

import { HomeComponent } from './pages/home/home.component';
import { KpisComponent } from './pages/kpis/kpis.component';
import { OicHomeComponent } from './pages/oic-home/oic-home.component';
import { PlanTrabajoComponent } from './pages/plan-trabajo/plan-trabajo.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[
      {
        path: 'home',
        component: OicHomeComponent
      },
      {
        path: 'datos-generales',
        component: DatosGeneralesComponent
      },
      {
        path: 'plan-trabajo',
        component: PlanTrabajoComponent
      },
      {
        path:'kpis',
        component: KpisComponent
      },
      {
        path: 'adm-workplan',
        component: AdmWorkplanComponent      
      },
      {
        path:'**',
        redirectTo: 'home'
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OicRoutingModule { }
