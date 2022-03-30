import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Colaborador } from '../../../shared/models/colaborador.interface';
import { MessageService, TreeNode } from 'primeng/api';
import { SharedService } from 'src/app/shared/services/shared.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';
import { Router } from '@angular/router';

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

  delete( dat: any) {
    console.log(dat);
  }

  update( dat: any) {
    console.log(dat);
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

  

  
  
}
