import { Component, OnInit } from '@angular/core';
import { FilterService } from "primeng/api";
import { TreeNode } from 'primeng/api';

import { OicInterface } from '../../models/oic.interface';
import { GetOicService } from '../../services/get-oic.service';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

  selectedOic?: OicInterface;
  filteredOic!: OicInterface[];
  oics?: OicInterface[];
  data: TreeNode[]=[];
  
  constructor(
    private filterService: FilterService,
    private oic: GetOicService
    ) { }
  

  ngOnInit(): void {
    
    this.oic.getOic()
    .subscribe( resp => { 
      <OicInterface[]> resp.data
      this.oics = resp.data;
    });

    this.data = [{
      label: 'Titular',
      type: 'person',
      styleClass: 'p-person',
      expanded: true,
      data: {name:'Walter White', 'avatar': 'oic.png'},
      children: [
          {
              label: 'Analista',
              type: 'person',
              styleClass: 'p-person',
              expanded: true,
              data: {name:'Saul Goodman', 'avatar': 'saul.jpg'},
          },
          {
              label: 'Asistente Administrativo A',
              type: 'person',
              styleClass: 'p-person',
              expanded: true,
              data: {name:'Mike E.', 'avatar': 'mike.jpg'},
             
          },
          {
              label: 'Asistente Administrativo B',
              type: 'person',
              styleClass: 'p-person',
              expanded: true,
              data: {name:'Jesse Pinkman', 'avatar': 'jesse.jpg'},
              
          }
      ]
  }];

  }

    text: string = "";

    results: string[] = [];


    filterOic(event: any) {
      //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.oics!.length; i++) {
        let oicItem = this.oics![i];
        if (oicItem.nombre_ente.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(oicItem);
        }
      }
  
      this.filteredOic = filtered;
    }
   
    

}
