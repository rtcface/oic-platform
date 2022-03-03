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
          label: 'Datos del OIC',
          icon: 'pi pi-fw pi-search',
          routerLink: '/oic/datos-generales'
      },
      {
          label: 'Plan de Trabajo',
          icon: 'pi pi-fw pi-list',
          routerLink: '/oic/plan-trabajo'
      },
      {
          label: 'Estadisticas de Procesos',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: '/oic/kpis'
      },
      {
          label: 'demo',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: '/oic/adm-workplan'
      },
      {
          label: 'Iniciar Sesión',
          icon: 'pi pi-fw pi-power-off',
          routerLink: '/auth/'
      },
      {
          label: 'Cerrar Sesión',
          icon: 'pi pi-fw pi-power-off',
          routerLink: '/auth/'
      }
  ];
}
  

}
