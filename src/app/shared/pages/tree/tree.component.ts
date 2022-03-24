import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  data: TreeNode[]=[];

  constructor() { }

  ngOnInit(): void {

    this.data = [{
      label: 'Titular',
      type: 'person',
      styleClass: 'p-person',
      expanded: true,
      data: {name:'Ramon Diaz Soler', avatar: 'oic.png'},
      children: [
          {
              label: 'Analista A',
              type: 'person',
              styleClass: 'p-person',
              expanded: true,
              data: {name:'Alan Diaz Soler', avatar: 'saul.jpg'},
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
  }];
  }

  display: boolean = false;

  onNodeSelect(event:any) {
    this.display = true;
}

}
