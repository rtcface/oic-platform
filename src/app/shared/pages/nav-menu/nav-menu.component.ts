import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  items: MenuItem[]=[];
  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          routerLink: '/oic/home'
      },
      {
          label: 'OIC Buscador',
          icon: 'pi pi-fw pi-search',
          routerLink: '/oic/find'
      },
      {
          label: 'OIC Listado',
          icon: 'pi pi-fw pi-list',
          routerLink: '/oic/list'
      },
      {
          label: 'OIC Dashboard',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: '/oic/kpis'
      }
  ];
}
  

}
