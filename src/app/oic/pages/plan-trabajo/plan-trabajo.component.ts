import { Component, OnInit } from '@angular/core';
import { FilterService } from 'primeng/api';
import { OicInterface } from '../../models/oic.interface';
import { GetOicService } from '../../services/get-oic.service';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { tree } from '../../models/tree.interface';

@Component({
  selector: 'app-plan-trabajo',
  templateUrl: './plan-trabajo.component.html',
  styleUrls: ['./plan-trabajo.component.scss']
})
export class PlanTrabajoComponent implements OnInit {

  filteredOic!: OicInterface[];
  oics?: OicInterface[];
  files!: TreeNode[];

  constructor(
    private filterService: FilterService,
    private oic: GetOicService
  ) { }

  ngOnInit(): void {

    this.oic.getOic()
      .subscribe( resp => { 
        <OicInterface[]> resp.data
        this.oics = resp.data;
        console.log(this.oics);
      });
      this.oic.getMenu()
        .subscribe( resp => {
          //console.log(resp);
          <tree[]> resp.data
          this.files = resp.data;
        });
  }

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

}
