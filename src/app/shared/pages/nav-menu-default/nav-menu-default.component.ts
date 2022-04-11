import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav-menu-default',
  templateUrl: './nav-menu-default.component.html',
  styleUrls: ['./nav-menu-default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuDefaultComponent implements OnInit {
  items: MenuItem[] = [];
  constructor(private authService: AuthService) {}

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  ngOnInit(): void {
    // if(this.items.length === 0){
    //   if(this.isLoggedIn?.verify_authentication === undefined)
    //     {
    //       this.items = this.authService.menuDefault;
    //     }
    //   this.items = this.authService.dmenu;
    //   }

    // if(this.authService.dmenu.length > 0){
    //   this.items = this.authService.dmenu;
    // }else{

    //   this.items = this.authService.menuDefault;
    // }

    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-fw pi-home',
        routerLink: '/oic/home',
      },
      {
        label: 'Datos del OIC',
        icon: 'pi pi-fw pi-search',
        routerLink: '/oic/datos-generales',
      },
      {
        label: 'Plan de Trabajo',
        icon: 'pi pi-fw pi-list',
        routerLink: '/oic/plan-trabajo',
      },
      {
        label: 'Estadisticas de Procesos',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: '/oic/kpis',
      },
      {
        label: 'Iniciar Sesión',
        icon: 'pi pi-fw pi-power-off',
        routerLink: '/auth/',
      },
    ];
  }

  counterRender(): boolean {
    console.log('Render de nav-menu-default');
    return true;
  }
}
