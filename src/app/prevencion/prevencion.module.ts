import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrevencionRoutingModule } from './prevencion-routing.module';
import { PrevencionPublicComponent } from './public/prevencion-public.component';
import { PrevencionAdminComponent } from './admin/prevencion-admin.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrevencionPublicComponent,
    PrevencionAdminComponent
  ],
  imports: [
    CommonModule,
    PrevencionRoutingModule,
    SharedModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PrevencionModule { }
