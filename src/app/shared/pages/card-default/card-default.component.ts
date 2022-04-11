import { ChangeDetectionStrategy, Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-card-default',
  templateUrl: './card-default.component.html',
  styleUrls: ['./card-default.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CardDefaultComponent  {

  constructor(  private router:Router, private authService:AuthService ) { }
  login(){
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/auth']);

}

counterRender(): boolean{

  console.log("Render de default-card");
  return true;
}

 
}
