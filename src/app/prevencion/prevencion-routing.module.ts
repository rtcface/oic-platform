import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrevencionPublicComponent } from './public/prevencion-public.component';
import { PrevencionAdminComponent } from './admin/prevencion-admin.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'public',
    component: PrevencionPublicComponent
  },
  {
    path: 'admin',
    component: PrevencionAdminComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrevencionRoutingModule { }
