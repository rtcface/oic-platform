import { Component, OnInit } from '@angular/core';
import { FilterService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { kpiByEnteQueryInput } from 'src/app/protected/models/kpis.interface';
import { ProtectedService } from 'src/app/protected/services/protected.service';
import { OicEnte, OicInterface } from '../../models/oic.interface';
import { filterWpd } from '../../models/tree.interface';
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
  data: any;
  
  constructor(
  
    private readonly filterService: FilterService,
    private readonly oic: GetOicService,
    private readonly pt: ProtectedService
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

  loadChart($event: OicEnte) {

    ////console.log("en el load?>>>>>>>>>>>>>>>>>>>>>>>>>", $event);
    const fiter: kpiByEnteQueryInput = {
      ente_publico: $event.ente.id
    }
    const ente:kpiByEnteQueryInput=
    {
      ente_publico: $event.ente.id
    }
    this.loadkpi(ente);

  }


  loadCharFinderSelectedOic($event: OicInterface) {
    
    const fiter: kpiByEnteQueryInput = {
      ente_publico: $event.id
    }

    //("en el load?>>>>>>>>>>>>>>>>>>>>>>>>>", $event);

    const ente:kpiByEnteQueryInput=
    {
      ente_publico: $event.id
    }
    
    this.loadkpi(ente);    
  }

  genChart()
  {
    this.data = {
      labels: [
        'Procedimientos Iniciados',
        'Procedimientos Concluidos',
        'Procedimientos Canalizados a la fiscalía'
        ],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]    
      };
  }


  loadkpi(filter:kpiByEnteQueryInput ) {
  //  //console.log("en el load?>>>>>>>>>>>>>>>>>>>>>>>>>", filter);
    this.pt.getKpis(filter).subscribe({
      next: (results) => {
        // //console.log("results", results);
        const { data } = results;
        // //console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data?.chart.length);
        const labels:string[] = [];
        const res:number[] = [];
        data?.chart.forEach(element => {
          labels.push(element.kpi);
          res.push(element.total_casos);
        }
        );
        this.data = {
          labels: labels,
          datasets: [
              {
                  data: res,
                  backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ],
                  hoverBackgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ]
              }]    
          };
        // this.resultGraph.length
        // //console.log("resultGraph>>>>>>>>", );

      },  
      error: (err) => {
        // //console.log("error", err);
      },
      complete: () => {
        // //console.log("complete");
      }
    });
  }





}
