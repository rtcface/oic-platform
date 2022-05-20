import { 
  ChangeDetectionStrategy, 
  Component, 
  EventEmitter, 
  Input,
  Output,
  SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { user_card } from '../../models/colaborador.interface';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CardComponent implements OnChanges {

 
  @Input() user!: user_card;
  @Output() onClear:EventEmitter<boolean> = new EventEmitter();
  
  constructor( private authService:AuthService, private router:Router ) { }
  ngOnChanges(changes: SimpleChanges): void {
    
    for (let propName in changes) {
      let change = changes[propName];
      let currentValue = change.currentValue;
      let previousValue = change.previousValue;
      console.log(propName + ': currentValue = ' + currentValue + ', previousValue = ' + previousValue);

      if (propName === 'user') {
        console.log("user changes>>>>>>>>>>>>>>" , changes[propName].currentValue);
        this.user = changes[propName].currentValue;}

      }
  }

 
  get isLoggedIn() {    
   // console.log("from card",this.authService.isLoggedIn?.login);
    return this.authService.isLoggedIn;
  }

  logout(){
    this.onClear.emit(true);
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['/oic']);
    
}

login()
{
  this.router.navigate(['/login']); 
}

counterRender(): boolean{
  console.log("Render de card");
  return true;
}


}
