import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChildChild, filterWpd, root, RootChild, tree } from 'src/app/oic/models/tree.interface';
import { GetOicService } from 'src/app/oic/services/get-oic.service';

@Component({
  selector: 'app-adm-workplan',
  templateUrl: './adm-workplan.component.html',
  styleUrls: ['./adm-workplan.component.scss'],
  providers: [MessageService]

})
export class AdmWorkplanComponent implements OnInit {

  id_ente:string = this.auth.idEnteAuth;
  files: TreeNode[] = [];
  nodes: any[]=[];
  selectedNode: any[] = [];


  constructor(
    private oic: GetOicService,
    private ms: MessageService,
    private auth: AuthService
  ) { }
  

  ngOnInit(): void {   
    this.loadWorkPlan();
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

  loadWorkPlan() {
    const fiter: filterWpd = {
      ente: {
        ente_publico: this.id_ente
      }
    }
    this.loadWpd(fiter);

  }

  loadWpd(filter: filterWpd) {

    this.oic.getWorkPlanFromGraph(filter)
      .subscribe({
        next: (result) => {
          const res: any = result.data!;
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> a", res.data.label);
          if (res.data.label !== null) {
          <tree[]> [res!.data!];
          //map to TreeNode
          this.files =[ res!.data].map(
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
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
        }

      });
      
        
       
      
    


  }


  showError() {
    this.ms.add({ severity: 'info', summary: 'Información', detail: 'No hay datos del ente solicitado...' });   //<-- Mensaje de error
  }


}
