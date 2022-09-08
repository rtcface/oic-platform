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
  idAuth: string = this.auServ.idUserAuth;
  ngOnInit(): void {
    this.loadTreeFromBoss();
  }

  loadTreeFromBoss() {
    const params: filterBoss = {
      boss: {
        boss: "631a24a995474a3a768c9e6c",
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
          // this.showMessageDinamic( 'error', 'Información', 'No hay datos del ente solicitado...');
          this.purgeTree();
        }
      },
      error: (err) => {
        
      },
    });
  }


  save() {
   
   
  }
  
  purgeTree() {
    this.data = [];
  }

}
