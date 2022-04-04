import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { AdmWorkplanComponent } from './pages/adm-workplan/adm-workplan.component';
import { AdmUsersComponent } from './pages/adm-users/adm-users.component';
import { AdmKpisComponent } from './pages/adm-kpis/adm-kpis.component';
import { AdmHomeComponent } from './pages/adm-home/adm-home.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import {  ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
  
    AdmWorkplanComponent,
    AdmUsersComponent,
    AdmKpisComponent,
    AdmHomeComponent
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    SharedModule,
    PrimeNgModule,
    ReactiveFormsModule
  ]
})
export class ProtectedModule { }
