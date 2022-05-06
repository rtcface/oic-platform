import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { TypePortalGuard } from './oic/guards/type-portal.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',       
  },  
  {
    path: '404',
    loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'protected',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
    canLoad: [ AuthGuard ],
    canActivate: [ AuthGuard ] 
  },
  {
    path: 'protected-admin',
    loadChildren: () => import('./protected-admin/protected-admin.module').then(m => m.ProtectedAdminModule),
    canLoad: [ AuthGuard ],
    canActivate: [ AuthGuard ] 
  },
  {
    path: 'oic/:type',
    loadChildren: () => import('./oic/oic.module').then(m => m.OicModule),
  },
  {
    path: '**',
    redirectTo: 'auth'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
