import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss']
})
export class AdmUsersComponent implements OnInit {

  isSave: boolean = false;
  idAuth:string = this.auServ.idUserAuth;

  
  
  constructor( private readonly auServ:AuthService) { }
  

  ngOnInit(): void {    
   
  }
    display: boolean = false;

    showDialog() {
        this.display = true;
        // console.log(this.display);
    }

    onNodeSelect(event:any) {
      this.display = true;
  }

}
