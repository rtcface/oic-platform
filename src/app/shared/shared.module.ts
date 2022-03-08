import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { NavMenuComponent } from './pages/nav-menu/nav-menu.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { CardComponent } from './pages/card/card.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NavMenuComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    NavMenuComponent
  ]
})
export class SharedModule { }
