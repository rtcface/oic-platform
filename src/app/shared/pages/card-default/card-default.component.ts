import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-card-default',
  templateUrl: './card-default.component.html',
  styleUrls: ['./card-default.component.scss']
})
export class CardDefaultComponent implements OnInit {

  constructor(  private router:Router, private authService:AuthService ) { }

  // private authService:AuthService,
  // get isLoggedIn() {    
  //  // console.log("from card",this.authService.isLoggedIn?.login);
  //   return this.authService.isLoggedIn;
  // }

  login(){
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/auth']);
}

  ngOnInit(): void {
    
  }

}
