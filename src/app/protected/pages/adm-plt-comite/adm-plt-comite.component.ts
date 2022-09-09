import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';
import { Colaborador } from 'src/app/shared/models/colaborador.interface';

@Component({
  selector: 'app-adm-plt-comite',
  templateUrl: './adm-plt-comite.component.html',
  styleUrls: ['./adm-plt-comite.component.scss']
})
export class AdmPltComiteComponent implements OnInit {
  data: TreeNode[] = [];
  constructor( private readonly auServ: AuthService) { }
  idEnteAuth: string = this.auServ.idEnteAuth;
  ngOnInit(): void {
    this.loadTreeFromBoss();
  }

  loadTreeFromBoss() {
    console.log("in load");
    const params: filterEnte = {
      boss: {
        ente: this.idEnteAuth,
      },
    };
     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el reload ",params);
    this.loadTree(params);
  }

  loadTree(params: filterBoss | filterEnte) {
   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ",params);
    this.auServ.get_tree_comite(params).subscribe({
      next: (result) => {
        const tree: any = result.data!;
        console.log(result);
        console.log(tree)
        if (tree.TreeColaboradoresData.data !== null) {
          this.data = [tree.TreeColaboradoresData];
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load del coite",this.data);
        } else {
          // this.showMessageDinamic( 'error', 'Información', 'No hay datos del ente solicitado...');
          this.purgeTree();
        }
      },
      error: (err) => {
        console.log(`este es el errer ${err}`)
      },
    });
  }


  save() {
   
   
  }
  
  purgeTree() {
    this.data = [];
  }

}
