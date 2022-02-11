import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './pages/add/add.component';
import { FindComponent } from './pages/find/find.component';
import { HomeComponent } from './pages/home/home.component';
import { KpisComponent } from './pages/kpis/kpis.component';
import { OicHomeComponent } from './pages/oic-home/oic-home.component';
import { OicListComponent } from './pages/oic-list/oic-list.component';


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
        path: 'oic-list',
        component:OicListComponent
      },
      {
        path:'find',
        component: FindComponent
      },
      {
        path:'add',
        component: AddComponent
      },
      {
        path:'kpis',
        component: KpisComponent
      },
      {
        path:'**',
        redirectTo: 'find'
      }      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OicRoutingModule { }
