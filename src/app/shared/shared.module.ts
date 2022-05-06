import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { NavMenuComponent } from './pages/nav-menu/nav-menu.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { CardComponent } from './pages/card/card.component';
import { NavMenuDefaultComponent } from './pages/nav-menu-default/nav-menu-default.component';
import { CardDefaultComponent } from './pages/card-default/card-default.component';
import { TreeComponent } from './pages/tree/tree.component';
import { FinderOicComponent } from './pages/finder-oic/finder-oic.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormUsersComponent } from './pages/form-users/form-users.component';
import { ViewUsersComponent } from './pages/view-users/view-users.component';
import { SppinerComponent } from './pages/sppiner/sppiner.component';
import { CardMenuComponent } from './pages/card-menu/card-menu.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NavMenuComponent,
    NavMenuDefaultComponent,
    CardComponent,
    CardDefaultComponent,
    TreeComponent,
    FinderOicComponent,
    FormUsersComponent,
    ViewUsersComponent,
    SppinerComponent,
    CardMenuComponent,
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    NavMenuComponent,
    NavMenuDefaultComponent,
    CardComponent,
    TreeComponent,
    FinderOicComponent,
    FormUsersComponent,
    ViewUsersComponent,
    SppinerComponent,
    CardMenuComponent,
  ]
})
export class SharedModule { }
