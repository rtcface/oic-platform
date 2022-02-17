import { Component, OnInit } from '@angular/core';
import { FilterService } from 'primeng/api';
import { OicInterface } from '../../models/oic.interface';
import { GetOicService } from '../../services/get-oic.service';

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.scss']
})
export class KpisComponent implements OnInit {

  selectedOic?: OicInterface;
  filteredOic!: OicInterface[];
  oics?: OicInterface[];
  
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

}
