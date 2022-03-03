import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { AdmWorkplanComponent } from './pages/adm-workplan/adm-workplan.component';
import { AdmUsersComponent } from './pages/adm-users/adm-users.component';
import { AdmKpisComponent } from './pages/adm-kpis/adm-kpis.component';


@NgModule({
  declarations: [
  
    AdmWorkplanComponent,
       AdmUsersComponent,
       AdmKpisComponent
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule
  ]
})
export class ProtectedModule { }
