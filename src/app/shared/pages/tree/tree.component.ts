import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { data } from '../../../auth/interfaces/user_token.interface';
import { Colaborador } from '../../models/colaborador.interface';

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

  constructor(private readonly as:AuthService ) { }

  ngOnInit(): void {

   



    const { avatar, charge, name,  }=this.isLoggedIn?.verify_authentication.user!;

    const children = [
      {
          label: charge,
          type: 'person',
          styleClass: 'p-person',
          expanded: true,
          data: {name, avatar},
      },
      {
          label: 'Asistente B',
          type: 'person',
          styleClass: 'p-person',
          expanded: true,
          data: {name:'Jose Peregrino Alva', avatar: 'mike.jpg'},
         
      },
      {
          label: 'Asistente C',
          type: 'person',
          styleClass: 'p-person',
          expanded: true,
          data: {name:'Raul Lima Juarez', avatar: 'jesse.jpg'},
          
      }
  ]

    this.data = [
      {
      label: 'Titular',
      type: 'person',
      styleClass: 'p-person',
      expanded: true,
      data: {name, avatar},
      children: children
  }
];


  }

  display: boolean = false;

  onNodeSelect(event:any) {
    this.onShowMessage.emit(true);
}

}
