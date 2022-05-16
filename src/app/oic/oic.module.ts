import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OicRoutingModule } from './oic-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { KpisComponent } from './pages/kpis/kpis.component';
import { SharedModule } from '../shared/shared.module';
import { OicHomeComponent } from './pages/oic-home/oic-home.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { DatosGeneralesComponent } from './pages/datos-generales/datos-generales.component';
import { PlanTrabajoComponent } from './pages/plan-trabajo/plan-trabajo.component';
import { PltHomeComponent } from './pages/plt-home/plt-home.component';

@NgModule({
  declarations: [
    HomeComponent, 
    KpisComponent,    
    OicHomeComponent, 
    DatosGeneralesComponent, 
    PlanTrabajoComponent, PltHomeComponent
  ],
  imports: [
    CommonModule,
    OicRoutingModule,
    SharedModule,
    PrimeNgModule
  ]
})
export class OicModule { }
