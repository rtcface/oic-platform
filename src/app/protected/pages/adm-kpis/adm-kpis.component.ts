import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { kpiAdd, chart, kpiByEnteQueryInput, kpiSelector } from '../../models/kpis.interface';
import { ProtectedService } from '../../services/protected.service';

@Component({
  selector: 'app-adm-kpis',
  templateUrl: './adm-kpis.component.html',
  styleUrls: ['./adm-kpis.component.scss'],
  providers: [MessageService]
})
export class AdmKpisComponent implements OnInit {

  id_ente:string = this.auth.idEnteAuth;
  saveKpiData:kpiAdd = {} as kpiAdd;
  resultGraph:chart[] = [];
  data: any;
  optionKpi:any[] = [];
  selectedKpi: any;
  

  saveForm = this.fb.group({
    typeCase: ['', Validators.required],   
    total: ['',[Validators.required]],
  });


  constructor( 
    private readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly ms: MessageService,
    private readonly pt: ProtectedService ) { }

  ngOnInit(): void {
    this.loadKpis();
  }

  validateField(field: string) {
    return this.saveForm.get(field)?.invalid && this.saveForm.get(field)?.touched;
  }

  getErrorMessage(field: string) {
    const message:string = "Debe ingresar un valor válido";
   
    return this.saveForm.get(field)?.hasError('required') ? message :
    this.saveForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
    '';    
  }

  saveKpi() {
   // console.log("en el save", this.saveForm.value);
    if(this.saveForm.valid) {
      this.saveKpiData.ente_publico = this.id_ente;
      const { total, typeCase } = this.saveForm.value;
      const tkpi:kpiSelector = typeCase;
      this.saveKpiData.description = tkpi.name;
      this.saveKpiData.kpi = tkpi.name;
      this.saveKpiData.total_casos = total;

      this.pt.saveKpi(this.saveKpiData).subscribe({
        next: (data) => {
          // console.log("data", data.data!);
         // this.data = data;
          this.saveForm.reset();
        },
        error: (err) => {
          // console.log("error", err);
        },
        complete: () => {
          this.loadKpis();
          this.ms.add({ severity: 'success', summary: 'Información', detail: 'Se ha guardado el dato correctamente...' });   //<-- Mensaje de error
          this.ngOnInit();
        }

      });

    }else {
      this.saveForm.markAllAsTouched();
    }

  }

  loadKpis() {
    const ente:kpiByEnteQueryInput=
    {
      ente_publico: this.id_ente
    }

    this.pt.getKpis(ente).subscribe({
      next: (results) => {
        // console.log("results", results);
        const { data } = results;
        // console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data?.chart.length);
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
        // console.log("resultGraph>>>>>>>>", );

      },  
      error: (err) => {
        // console.log("error", err);
      },
      complete: () => {
        // console.log("complete");
      }
    });

    

    this.optionKpi = [
      {icon: 'pi pi-chart-bar', name: 'Procedimientos iniciados', value: 1, },
      {icon: 'pi pi-chart-line', name: 'Procedimientos concluidos', value: 2},
      {icon: 'pi pi-chart-pie', name: 'Procedimientos canalizados', value: 3},     
  ];
  }
  cambiaData(event: any) {
    //console.log("event", event);
  }
}
