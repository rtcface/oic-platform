import { 
  ChangeDetectionStrategy, 
  Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent  {

  constructor( private authService:AuthService, private router:Router ) { }

 
  get isLoggedIn() {    
   // console.log("from card",this.authService.isLoggedIn?.login);
    return this.authService.isLoggedIn;
  }

  logout(){
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/oic']);
}

counterRender(): boolean{
  console.log("Render de card");
  return true;
}


}
