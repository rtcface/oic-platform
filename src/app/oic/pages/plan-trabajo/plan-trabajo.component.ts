import { Component, OnInit } from '@angular/core';

import { TreeNode } from 'primeng/api';

import { GetOicService } from '../../services/get-oic.service';
import { tree, filterWpd } from '../../models/tree.interface';
import { OicEnte, OicInterface } from '../../models/oic.interface';
import { MutationResult } from 'apollo-angular';

@Component({
  selector: 'app-plan-trabajo',
  templateUrl: './plan-trabajo.component.html',
  styleUrls: ['./plan-trabajo.component.scss']
})
export class PlanTrabajoComponent implements OnInit {


  files!: TreeNode[];

  constructor(
    private oic: GetOicService
  ) { }

  ngOnInit(): void {



  }


  filterTree(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.files!.length; i++) {
      let fileItem = this.files![i];
      if (fileItem.label!.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(fileItem);
      }
    }

    this.files = filtered;
  }

  nodeSelect(event: any) {

    event.node.url ? this.redirect(event.node.url) : null;

    //console.log(event.node.data);
  }

  redirect(url: string) {
    window.open(url, '_blank');
  }

  loadWorkPlan($event: OicEnte) {
    const fiter: filterWpd = {
      ente: {
        ente_publico: $event.ente.id
      }
    }
    this.loadWpd(fiter);

  }


  loadWorkPlanFinderSelectedOic($event: OicInterface) {

    const fiter: filterWpd = {
      ente: {
        ente_publico: $event.id
      }
    }
    this.loadWpd(fiter);
    console.log("this.ente desde hijo", $event.id);
  }

  loadWpd(filter: filterWpd) {

    this.oic.getWorkPlanFromGraph(filter)
      .subscribe({
        next: (result: MutationResult<tree[]>) => {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
          if (result.data !== null) {
            this.files = result!.data!;
          }
          else {
            //this.showError();
          }
        },
        error: (error) => {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
        }

      });
      
        
       
      
    


  }



}
