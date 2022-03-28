import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})

export class TreeComponent implements OnInit {
  @Output() onShowMessage: EventEmitter<boolean> = new EventEmitter();
  // Inpu for tree component recive filterEnte or filterBoss
  @Input() filterData: filterBoss | filterEnte | null = null;

 
  get isLoggedIn() {
    return this.as.isLoggedIn;
  }

  get loadColaboradores() {    
    return this.loadTree(this.filterData!);
  }


  data: TreeNode[] = [];

  loadTree(params: filterBoss | filterEnte) {
    this.purgeTree();
    console.log(">>>>>>>>>>>desde el loadtree>>>>>>>>>>>>>>>>>>>>", params);
    this.as.get_tree_colaboradores(params).subscribe({
      next: (result) => {

        const tree: any = result.data!;
        this.data = [tree.getColaboresTreeData];

      },
      error: (err) => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      }
    });

  }

  constructor(
    private readonly as: AuthService
  ) { }

  ngOnInit(): void {

    this.purgeTree();

    if (this.isLoggedIn?.verify_authentication !== undefined) {
      const { id } = this.isLoggedIn?.verify_authentication.user!;
      if (id) {

        const params: filterBoss = {
          boss: {
            boss: id
          }
        };
        this.loadTree(params);
      }

    } else {
      console.log("no esta logueado");
      this.loadTree(this.filterData!);
      console.log("this.filterData", this.filterData);
    }

  }

 results = this.loadColaboradores;

  

  display: boolean = false;

  onNodeSelect(event: any) {
    this.onShowMessage.emit(true);
  }


  //purge tree

  purgeTree() {
    this.data = [];
  }


}

function isObjEmpty(obj:any) {  
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}
