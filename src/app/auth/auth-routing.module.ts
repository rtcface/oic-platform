import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginMainComponent } from './pages/login-main/login-main.component';
import { MainCardsComponent } from './pages/main-cards/main-cards.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component:LoginMainComponent,
    children: [
      {
        path: '',
        component: MainCardsComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path:'**',
        redirectTo:''
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
