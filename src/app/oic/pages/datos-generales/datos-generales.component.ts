import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { OicInterface, OicEnte } from '../../models/oic.interface';

import { filterBoss, filterEnte } from '../../models/tree.interface';


@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss'],
  providers: [MessageService]
})
export class DatosGeneralesComponent implements OnInit {

  data: TreeNode[] = [];
  filter: filterBoss | filterEnte | null = null;
 
  ente:string = '';
  haveError:boolean = false;

 
  constructor(
    private readonly as: AuthService,
    private readonly ms: MessageService
    ) { }
  

  ngOnInit(): void {
    
  }

  

loadTreefromFinder( $event:OicEnte){
  this.ente = $event.ente.id;
  
  const params: filterEnte = {
    boss: {
      ente: $event.ente.id
    }
  }
  this.loadTree(params);
  console.log("this.ente desde hijo",$event.ente.id);  
}

loadTreeFromFinderSelectedOic( $event:OicInterface){
  this.ente = $event.id;
  
  const params: filterEnte = {
    boss: {
      ente: $event.id
    }
  }
  this.loadTree(params);
  console.log("this.ente desde hijo",$event.id);
}




loadTree(params: filterBoss | filterEnte) {
  console.log(">>>>>>>>>>>CARGANDO INFORMACION DEL ARBOL>>>>>>>>>>>>>>>>>>>>", params);
  this.as.get_tree_colaboradores(params).subscribe({
    next: (result) => {
      const tree: any = result.data!;
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>",tree);
      if(tree.getColaboresTreeData.data !== null){
        this.data = [tree.getColaboresTreeData];
      }
      else{
        this.showError();
        this.purgeTree();
      }

    },
    error: (err) => {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
    }
  });

}

purgeTree() {
  this.data = [];
}

showError() {
  this.ms.add({ severity: 'info', summary: 'Información', detail: 'No hay datos del ente solicitado...' });   //<-- Mensaje de error
}

   

}
