import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OicRoutingModule } from './oic-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { FindComponent } from './pages/find/find.component';
import { AddComponent } from './pages/add/add.component';
import { KpisComponent } from './pages/kpis/kpis.component';
import { SharedModule } from '../shared/shared.module';
import { OicListComponent } from './pages/oic-list/oic-list.component';
import { OicHomeComponent } from './pages/oic-home/oic-home.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    HomeComponent,
    FindComponent,
    AddComponent,
    KpisComponent,
    OicListComponent,
    OicHomeComponent
  ],
  imports: [
    CommonModule,
    OicRoutingModule,
    SharedModule,
    PrimeNgModule
  ]
})
export class OicModule { }
