import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedAdminRoutingModule } from './protected-admin-routing.module';
import { AddContralorComponent } from './pages/add-contralor/add-contralor.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    AddContralorComponent,
    AdminHomeComponent
  ],
  imports: [
    CommonModule,
    ProtectedAdminRoutingModule,
    SharedModule,
    PrimeNgModule

  ]
})
export class ProtectedAdminModule { }
