import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmHomeComponent } from './pages/adm-home/adm-home.component';
import { AdmKpisComponent } from './pages/adm-kpis/adm-kpis.component';
import { AdmPltCodigoEticaComponent } from './pages/adm-plt-codigo-etica/adm-plt-codigo-etica.component';
import { AdmPltComiteComponent } from './pages/adm-plt-comite/adm-plt-comite.component';
import { AdmPltRulesComponent } from './pages/adm-plt-rules/adm-plt-rules.component';
import { AdmUsersComponent } from './pages/adm-users/adm-users.component';
import { AdmWorkplanComponent } from './pages/adm-workplan/adm-workplan.component';
import { AdmActividadesComponent } from './pages/adm-actividades/adm-actividades.component';
import { AdmQuejasComponent } from './pages/adm-quejas/adm-quejas.component';
import { AdmPrevencionComponent } from './pages/adm-prevencion/adm-prevencion.component';

const routes: Routes = [
  {
    path: '',
    component:AdmHomeComponent,
    children: [    
      {
        path: '',
        component: AdmUsersComponent
      },
      {
        path: 'plt',
        component:AdmPltCodigoEticaComponent
      },
      {
        path: 'adm-codigo-etica',
        component: AdmPltCodigoEticaComponent
      },
      {
        path: 'adm-comite',
        component: AdmPltComiteComponent
      },
      {
        path: 'adm-rules',
        component: AdmPltRulesComponent
      },
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
        path: 'prevencion',
        component: AdmPrevencionComponent
      },
      {
        path: '**',
        redirectTo: 'adm-users'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
