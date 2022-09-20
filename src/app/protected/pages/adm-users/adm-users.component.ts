import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService, TreeNode } from 'primeng/api';

import { AuthService } from '../../../auth/services/auth.service';
import {
  Colaborador,
  delete_user,
  user_edit,
} from '../../../shared/models/colaborador.interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';

@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss'],
  providers: [MessageService],
})
export class AdmUsersComponent implements OnInit {
  isSave: boolean = false;
  isSaved: boolean = false;
  idAuth: string = this.auServ.idUserAuth;
  data: TreeNode[] = [];
  filter: filterBoss | filterEnte | null = null;
  haveError: boolean = false;
  userEdit: user_edit = {} as user_edit;

  constructor(
    private readonly auServ: AuthService,
    private readonly ms: MessageService,
    private readonly ss: SharedService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadTreeFromBoss();
  }

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  onNodeSelect(event: any) {
    this.showDialog();
  }

  save(colaborador: Colaborador) {
    colaborador.parentId = this.idAuth;
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el save ",colaborador);
    this.ss.save_Colaborador(colaborador).subscribe({
      next: (result) => {
        // console.log(result);
        if (result.data!.registerColaborador.haveError) {
          this.showMessageDinamic( "error", 'Error',result.data!.registerColaborador.Err);
          this.isSaved = false;
        } else {
          this.isSaved = true;
          this.showMessageDinamic( 'success', 'Éxito', 'Usuario registrado correctamente...');          
        }
      },
      error: (err) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
        this.isSaved = false;
      },
      complete: () => {
        this.loadTreeFromBoss();
       
               
      },
    });
  }

  delete(user: delete_user) {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el delete ",user);
    this.ss.delete_user(user).subscribe({
      next: (result) => {
        // console.log(result);
        if (result.data!.id === '') {
          this.showMessageDinamic( 'error', 'Error', 'No se pudo eliminar el usuario...');
        } else {
          this.showMessageDinamic( 'success', 'Información', 'Usuario eliminado correctamente...');
        }
      },
      error: (err) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      },
      complete: () => {
        this.loadTreeFromBoss();
        this.display = false;
      },
    });
  }

  update(user: user_edit) {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el update pather ",user);

    this.ss.update_Colaborador(user).subscribe({
      next: (result) => {
        // console.log(result);
        if (result.data!.updateColaborador.haveError) {
          this.showMessageDinamic( "error", 'Error',result.data!.updateColaborador.Err);
        } else {
          this.showMessageDinamic( "success", 'Información', 'Usuario actualizado correctamente...');
        }
      },
      error: (err) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      },
      complete: () => {
        this.loadTreeFromBoss();
        this.display = false;
      },
    });
  }

  loadTreeFromBoss() {
    const params: filterBoss = {
      boss: {
        boss: this.idAuth,
      },
    };
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el reload ",params);
    this.loadTree(params);
  }

  loadTree(params: filterBoss | filterEnte) {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ",params);
    this.auServ.get_tree_colaboradores(params).subscribe({
      next: (result) => {
        const tree: any = result.data!;
        if (tree.getColaboresTreeData.data !== null) {
          this.data = [tree.getColaboresTreeData];
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ",this.data);
        } else {
          this.showMessageDinamic( 'error', 'Información', 'No hay datos del ente solicitado...');
          this.purgeTree();
        }
      },
      error: (err) => {
        
      },
    });
  }

  purgeTree() {
    this.data = [];
  }

  showMessageDinamic(severity:string ,summary: string, detail: string) {
    this.ms.add({ severity, summary, detail}); //<-- Mensaje de error
  }

  updateUserData(user: user_edit) {
    
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el update ",user);
    this.userEdit = user;
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el this update ",this.userEdit);
    this.showDialog();
    
  }
}


