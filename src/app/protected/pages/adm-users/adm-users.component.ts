import { Component, OnInit } from '@angular/core';
import { FilterService } from "primeng/api";
import { TreeNode } from 'primeng/api';
import { OicInterface } from 'src/app/oic/models/oic.interface';
import { GetOicService } from 'src/app/oic/services/get-oic.service';


@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss']
})
export class AdmUsersComponent implements OnInit {

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
   
    display: boolean = false;

    showDialog() {
        this.display = true;
        // console.log(this.display);
    }

    onNodeSelect(event:any) {
      this.display = true;
  }

}
