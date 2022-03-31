import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService, TreeNode } from 'primeng/api';



import { AuthService } from '../../../auth/services/auth.service';
import { Colaborador, delete_user, user_edit } from '../../../shared/models/colaborador.interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';

@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss'],
  providers: [MessageService]
})
export class AdmUsersComponent implements OnInit {

  isSave: boolean = false;
  isSaved: boolean = false;
  idAuth: string = this.auServ.idUserAuth;
  data: TreeNode[] = [];
  filter: filterBoss | filterEnte | null = null;
  haveError:boolean = false;
  userEdit:user_edit = {} as user_edit;
 
  
  
  
  
  constructor( 
    private readonly auServ:AuthService,
    private readonly ms:MessageService,
    private readonly ss:SharedService,
    private readonly router:Router
  
    ) { }
  

  ngOnInit(): void {
    this.loadTreeFromBoss();    
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
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el save ",colaborador);
    this.ss.save_Colaborador(colaborador).subscribe({
      next: (result) => {
        console.log(result);
        if(result.data!.registerColaborador.haveError){
          this.showErrorDinamic(result.data!.registerColaborador.Err);
        }else
        {
          this.showMessageOK();
          this.isSaved = true;
          
        }
      },
      error: (err) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      },
      complete: () => {       
       
        this.reloadCurrentPage();
        
      }
    });

    
  }

  delete( user: delete_user) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el delete ",user);
    this.ss.delete_user(user).subscribe({
      next: (result) => {
        console.log(result);
        if(result.data!.id === ""){
          this.showErrorDinamic("No se pudo eliminar el usuario");
        }else
        {
          this.showMessageOK();         
        }
      },
      error: (err) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      },
      complete: () => {       
       
        this.reloadCurrentPage();
        
      }
    });
  }

  update( user:user_edit ) {

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el update pather ",user);

    this.ss.update_Colaborador(user).subscribe({
      next: (result) => {
        console.log(result);
        if(result.data!.updateColaborador.haveError){
          this.showErrorDinamic(result.data!.updateColaborador.Err);
        }else
        {
          this.showMessageOK();         
        }
      },
      error: (err) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      },
      complete: () => {       
       
        this.reloadCurrentPage();
        
      }
    });
    
  }

  showMessageOK(){
    this.ms.add({severity:'success', summary:'Guardado', detail:'Guardado con exito'});
  }



  loadTreeFromBoss() {    
    const params: filterBoss = {
      boss: {
        boss: this.idAuth
      }
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el reload ",params);
    this.loadTree(params);   
  }


  loadTree(params: filterBoss | filterEnte) {    
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ",params);
    this.auServ.get_tree_colaboradores(params).subscribe({
      next: (result) => {
        const tree: any = result.data!;        
        if(tree.getColaboresTreeData.data !== null){
          this.data = [tree.getColaboresTreeData];
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ",this.data);
        }
        else{
          this.showError();
          this.purgeTree();
        }  
      },
      error: (err) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
        //this.showErrorDinamic(err);
      }
    });  
  }

  purgeTree() {
    this.data = [];
  }
  
  showError() {
    this.ms.add({ severity: 'info', summary: 'Información', detail: 'No hay datos del ente solicitado...' });   //<-- Mensaje de error
  }

  showErrorDinamic( err:any ) {
    this.ms.add({ severity: 'error', summary: 'Error', detail: err });   //<-- Mensaje de error
  }

  reloadCurrentPage() {
    window.location.reload();
   }

  //create method to reload component tree before from saved

  updateUserData( user:user_edit ) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el update ",user);
    this.userEdit = user;  
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el this update ",this.userEdit);
    this.showDialog();
  }
  
  
}
