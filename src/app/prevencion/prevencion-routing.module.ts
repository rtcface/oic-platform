import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Routes for public and admin will be added here in phases 2 and 3
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
