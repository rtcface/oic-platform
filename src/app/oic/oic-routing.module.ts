import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmWorkplanComponent } from '../protected/pages/adm-workplan/adm-workplan.component';
import { DatosGeneralesComponent } from './pages/datos-generales/datos-generales.component';

import { HomeComponent } from './pages/home/home.component';
import { KpisComponent } from './pages/kpis/kpis.component';
import { OicHomeComponent } from './pages/oic-home/oic-home.component';
import { PlanTrabajoComponent } from './pages/plan-trabajo/plan-trabajo.component';
import { PltHomeComponent } from './pages/plt-home/plt-home.component';
import { PltCodigoEticaComponent } from './pages/plt-codigo-etica/plt-codigo-etica.component';
import { PltComiteEticaComponent } from './pages/plt-comite-etica/plt-comite-etica.component';
import { PltPreguntasComponent } from './pages/plt-preguntas/plt-preguntas.component';
import { PltContactoComponent } from './pages/plt-contacto/plt-contacto.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[
      {
        path: '',
        component:OicHomeComponent
      },     
      {
        path: 'plt',
        component: PltHomeComponent, 
            
      },
      {
        path: 'plt-codigo-etica',
        component: PltCodigoEticaComponent,
      },
      {
        path: 'plt-comite-etica',
        component: PltComiteEticaComponent,
      },
      {
        path: 'plt-preguntas',
        component: PltPreguntasComponent,
      },
      {
        path: 'plt-contacto',
        component: PltContactoComponent,
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
        component: AdmWorkplanComponent , 
            
      },      
      {
        path:'**',
        redirectTo: '/'
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OicRoutingModule { }
