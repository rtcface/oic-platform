import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '404',
    loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'oic',
    loadChildren: () => import('./oic/oic.module').then(m => m.OicModule)
  },
  {
    path: '**',
    redirectTo: 'oic'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
