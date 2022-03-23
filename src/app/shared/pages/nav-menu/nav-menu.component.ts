import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';



@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  items: MenuItem[]=[];
  constructor( 
      private authService:AuthService,           
      ) { }

  get isLoggedIn() {         
      return this.authService.isLoggedIn;
    }

  ngOnInit(): void {


    this.items = this.authService.dmenu;
   

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
      
     

    
}
}
