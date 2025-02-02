import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { OicInterface, OicEnte } from '../../models/oic.interface';

import { filterBoss, filterEnte } from '../../models/tree.interface';
import { user_edit } from '../../../shared/models/colaborador.interface';


@Component({
  selector: 'app-plt-comite-etica',
  templateUrl: './plt-comite-etica.component.html',
  styleUrls: ['./plt-comite-etica.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PltComiteEticaComponent {


  data: TreeNode[] = [];
  filter: filterBoss | filterEnte | null = null;
 
  ente:string = '';
  haveError:boolean = false;
  display: boolean = false;
  selectedUser:user_edit = {} as user_edit;

 
  constructor(
    private readonly as: AuthService,
    private readonly ms: MessageService
    ) { }

loadTreefromFinder( $event:OicEnte){
  this.ente = $event.ente.id;
  
  const params: filterEnte = {
    boss: {
      ente: $event.ente.id
    }
  }
  this.loadTree(params);
  ////console.log("this.ente desde hijo",$event.ente.id);  
}

loadTreeFromFinderSelectedOic( $event:OicInterface){
  this.ente = $event.id;
  
  const params: filterEnte = {
    boss: {
      ente: $event.id
    }
  }
  this.loadTree(params);
  ////console.log("this.ente desde hijo",$event.id);
}




loadTree(params: filterBoss | filterEnte) {
  ////console.log(">>>>>>>>>>>CARGANDO INFORMACION DEL ARBOL>>>>>>>>>>>>>>>>>>>>", params);
  this.as.get_tree_comite(params).subscribe({
    next: (result) => {
      //console.log(result);
      const tree: any = result.data!;
      ////console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>",tree);
      if(tree.TreeColaboradoresData.data !== null){
        this.data = [tree.TreeColaboradoresData];
      }
      else{
        this.showError();
        this.purgeTree();
      }

    },
    error: (err) => {
      ////console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
    }
  });

}

purgeTree() {
  this.data = [];
}

viewUserData( user: user_edit ){
  ////console.log(">>>>>>>>>>>>>>>",user);
  this.selectedUser = user;
  this.showPopup();
}

showError() {
  this.ms.add({ severity: 'info', summary: 'Información', detail: 'No hay datos del ente solicitado...' });   //<-- Mensaje de error
}
showPopup(){
  this.display = true;
}


}
