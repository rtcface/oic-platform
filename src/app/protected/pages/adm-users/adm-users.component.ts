import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { data } from '../../../auth/interfaces/user_token.interface';
import { Colaborador } from '../../../shared/models/colaborador.interface';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss'],
  providers: [MessageService]
})
export class AdmUsersComponent implements OnInit {

  isSave: boolean = false;
  idAuth: string = this.auServ.idUserAuth;
  data:any = {};

  
  
  constructor( 
    private readonly auServ:AuthService,
    private readonly ms:MessageService,
    private readonly ss:SharedService
    ) { }
  

  ngOnInit(): void {    
  //  this.idAuth = this.auServ.idUserAuth;
  //  console.log("In the father",this.idAuth);
  }
    display: boolean = false;

    showDialog() {
        this.display = true;       
    }

    onNodeSelect(event:any) {
      this.display = true;
  }

  save( colaborador: Colaborador) {
    colaborador.parentId = this.idAuth;
    this.ss.save_Colaborador(colaborador);
    this.showMessageOK();
  }

  delete( dat: any) {
    console.log(dat);
  }

  update( dat: any) {
    console.log(dat);
  }

  showMessageOK(){
    this.ms.add({severity:'success', summary:'Guardado', detail:'Guardado con exito'});
  }

}
