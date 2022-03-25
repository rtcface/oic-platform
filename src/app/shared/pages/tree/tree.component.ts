import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { GetColaboresTreeData } from '../../../auth/interfaces/user_token.interface';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Output() onShowMessage: EventEmitter<boolean> = new EventEmitter(); 

  get isLoggedIn() {         
    return this.as.isLoggedIn;
  }

  data: TreeNode[]=[];

  constructor(
    private readonly as:AuthService  
    ) { }

  ngOnInit(): void {

    const { id  }=this.isLoggedIn?.verify_authentication.user!;

    console.log("id desde tree",id);
    const results = this.as.get_tree_colaboradores(id).subscribe({
      next: (result) => {
        
       
        //this.data = 
        const tree:any = result.data!;

        console.log("data------->",tree.getColaboresTreeData);    
        this.data = [tree.getColaboresTreeData];
        console.log("data------->",this.data);
        
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      
      }
    });
   

    //this.data = [];


  }

  display: boolean = false;

  onNodeSelect(event:any) {
    this.onShowMessage.emit(true);
}

}
