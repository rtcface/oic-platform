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
          label: 'Inicio',
          icon: 'pi pi-fw pi-home',
          routerLink: '/oic/home'
      },
      {
          label: 'Datos Del OIC',
          icon: 'pi pi-fw pi-search',
          routerLink: '/oic/datos-generales'
      },
      {
          label: 'Plan De Trabajo',
          icon: 'pi pi-fw pi-list',
          routerLink: '/oic/plan-trabajo'
      },
      {
          label: 'Estadisticas De Procesos',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: '/oic/kpis'
      },
      {
          label: 'Iniciar Sesión',
          icon: 'pi pi-fw pi-power-off',
          routerLink: '/auth/login'
      }
  ];
}
  

}
