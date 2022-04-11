import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent implements OnInit {
  items: MenuItem[] = [];
  constructor(private authService: AuthService) {}

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  ngOnInit(): void {
    this.items = this.authService.dmenu;
  }

  counterRender(): boolean{
    console.log("Render de nav-menu");
    return true;
  }
}
