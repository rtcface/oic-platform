import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';
import { Colaborador, delete_user, user_edit } from 'src/app/shared/models/colaborador.interface';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-adm-plt-comite',
  templateUrl: './adm-plt-comite.component.html',
  styleUrls: ['./adm-plt-comite.component.scss'],
  providers: [MessageService],
})
export class AdmPltComiteComponent implements OnInit {
  isSave: boolean = false;
  isSaved: boolean = false;
  data: TreeNode[] = [];
  userEdit: user_edit = {} as user_edit;
  constructor(
    private readonly auServ: AuthService,
    private readonly ms: MessageService,
    private readonly ss: SharedService
  ) {}

  idEnteAuth: string = this.auServ.idEnteAuth;
  ngOnInit(): void {
    this.loadTreeFromBoss();
  }

  loadTreeFromBoss() {
    console.log('in load');
    const params: filterEnte = {
      boss: {
        ente: this.idEnteAuth,
      },
    };
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el reload ', params);
    this.loadTree(params);
  }

  loadTree(params: filterBoss | filterEnte) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ', params);
    this.auServ.get_tree_comite(params).subscribe({
      next: (result) => {
        const tree: any = result.data!;
        console.log(result);
        console.log(tree);
        if (tree.TreeColaboradoresData.data !== null) {
          this.data = [tree.TreeColaboradoresData];
          console.log(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load del coite',
            this.data
          );
        } else {
          // this.showMessageDinamic( 'error', 'Información', 'No hay datos del ente solicitado...');
          this.purgeTree();
        }
      },
      error: (err) => {
        console.log(`este es el errer ${err}`);
      },
    });
  }

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  onNodeSelect(event: any) {
    this.showDialog();
  }

  purgeTree() {
    this.data = [];
  }

  save(colaborador: Colaborador) {
    console.log('aqui', colaborador);

    this.ss.get_president(this.idEnteAuth).subscribe({
      next: (result) => {
        console.log(result);
        colaborador.parentId = result.data?.PresidetByEnte.id!;
      },
      error: (err) => {
        console.log(err);        
      },
      complete: () => {
        
      },
    });

    console.log('ntoeuteotausntaoutaoh', colaborador.parentId);
        //colaborador.parentId="631b4cd556c7051a8804ffe5";
        if (colaborador.parentId !== '' && colaborador.parentId !== undefined) {
          console.log(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el save ',
            colaborador
          );
          this.ss.save_Member(colaborador).subscribe({
            next: (result) => {
              console.log(result);
              if (result.data !== undefined && result.data !== null) {
                this.isSaved = true;
                this.showMessageDinamic(
                  'success',
                  'Éxito',
                  'Usuario registrado correctamente...'
                );
              } else {
                this.showMessageDinamic('error', 'Error', 'Algo sali mal ;-()');
                this.isSaved = false;
              }
            },
            error: (err) => {
              console.log(
                '>>>>>>>>>>>>>>>>>>>>>>>>>>>4Error en la consulta',
                err
              );
              this.isSaved = false;
            },
            complete: () => {
              this.loadTreeFromBoss();
            },
          });
        } else {
          this.ss.save_President(colaborador, this.idEnteAuth).subscribe({
            next: (result) => {
              console.log(result);
              if (result.data !== undefined && result.data !== null) {
                this.isSaved = true;
                this.showMessageDinamic(
                  'success',
                  'Éxito',
                  'Usuario registrado correctamente...'
                );
              } else {
                this.showMessageDinamic('error', 'Error', 'Algo sali mal ;-()');
                this.isSaved = false;
              }
            },
            error: (err) => {
              console.log(
                '>>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta',
                err
              );
              this.isSaved = false;
            },
            complete: () => {
              this.loadTreeFromBoss();
            },
          });
        }
  }

  delete(user: delete_user) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el delete ', user);
    this.ss.delete_member(user).subscribe({
      next: (result) => {
        console.log(result);
        if (result.data!.id === '') {
          this.showMessageDinamic(
            'error',
            'Error',
            'No se pudo eliminar el usuario...'
          );
        } else {
          this.showMessageDinamic(
            'success',
            'Información',
            'Usuario eliminado correctamente...'
          );
        }
      },
      error: (err) => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta', err);
      },
      complete: () => {
        this.loadTreeFromBoss();
        this.display = false;
      },
    });
  }

  update(user: user_edit) {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el update pather ",user);

    this.ss.update_Member(user).subscribe({
      next: (result) => {
        // console.log(result);
        if (result.data!.updateColaborador.haveError) {
          this.showMessageDinamic(
            'error',
            'Error',
            result.data!.updateColaborador.Err
          );
        } else {
          this.showMessageDinamic(
            'success',
            'Información',
            'Usuario actualizado correctamente...'
          );
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
  showMessageDinamic(severity: string, summary: string, detail: string) {
    this.ms.add({ severity, summary, detail }); //<-- Mensaje de error
  }

  updateUserData(user: user_edit) {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el update ",user);
    this.userEdit = user;
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el this update ",this.userEdit);
    this.showDialog();
  }
}
