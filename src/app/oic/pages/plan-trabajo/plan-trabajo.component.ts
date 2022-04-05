import { Component, OnInit } from '@angular/core';

import { MessageService, TreeNode } from 'primeng/api';

import { GetOicService } from '../../services/get-oic.service';
import { tree, filterWpd, ChildChild, root, RootChild } from '../../models/tree.interface';
import { OicEnte, OicInterface } from '../../models/oic.interface';

@Component({
  selector: 'app-plan-trabajo',
  templateUrl: './plan-trabajo.component.html',
  styleUrls: ['./plan-trabajo.component.scss'],
  providers: [MessageService]
})
export class PlanTrabajoComponent implements OnInit {


  files: TreeNode[] = [];

  constructor(
    private oic: GetOicService,
    private ms: MessageService
  
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
    // console.log("this.ente desde hijo", $event.id);
  }

  loadWpd(filter: filterWpd) {

    this.oic.getWorkPlanFromGraph(filter)
      .subscribe({
        next: (result) => {
          const tree: any = result.data!;
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> a", tree.data.label);
          if (tree.data.label !== null) {
          <tree[]> [tree!.data!];
          //map to TreeNode
          this.files =[ tree!.data].map(
            (item: root) => {
              return {
                label: item.label,
                data: item.data,
                children: item.children!.map(
                  (child: RootChild) => {
                    return {
                      label: child.label,
                      data: child.data,
                      children: child.children!.map(
                        (childChild: ChildChild) => {
                          return{
                            label: childChild.label,
                            data: childChild.data,
                            icon: childChild.icon,
                            url: childChild.url
                          }                        
                    })
                  }
                }
                )
              }
                
            });
          }
          else {
            this.showError();
            this.files = [];
          }
            
         
        },
        error: (error) => {
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
        }

      });
      
        
       
      
    


  }


  showError() {
    this.ms.add({ severity: 'info', summary: 'Información', detail: 'No hay datos del ente solicitado...' });   //<-- Mensaje de error
  }


}
