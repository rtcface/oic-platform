import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { kpiAdd, chart, kpiByEnteQueryInput, kpiSelector } from '../../models/kpis.interface';
import { ProtectedService } from '../../services/protected.service';

@Component({
  selector: 'app-adm-kpis',
  templateUrl: './adm-kpis.component.html',
  styleUrls: ['./adm-kpis.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AdmKpisComponent implements OnInit {

  id_ente:string = this.auth.idEnteAuth;
  saveKpiData:kpiAdd = {} as kpiAdd;
  resultGraph:chart[] = [];
  data: any;
  optionKpi:any[] = [];
  selectedKpi: any;
  
  // Nuevas variables para la tabla y edición
  kpisList: chart[] = [];
  displayEditDialog: boolean = false;
  selectedKpiId: string = '';

  saveForm = this.fb.group({
    typeCase: ['', Validators.required],   
    total: ['', [Validators.required, Validators.min(0)]],
  });

  editForm = this.fb.group({
    typeCase: ['', Validators.required],
    total: ['', [Validators.required, Validators.min(0)]]
  });

  constructor( 
    private readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly ms: MessageService,
    private readonly pt: ProtectedService,
    private readonly confirmationService: ConfirmationService ) { }

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
   // //console.log("en el save", this.saveForm.value);
    if(this.saveForm.valid) {
      this.saveKpiData.ente_publico = this.id_ente;
      const { total, typeCase } = this.saveForm.value;
      const tkpi:kpiSelector = typeCase;
      this.saveKpiData.description = tkpi.name;
      this.saveKpiData.kpi = tkpi.name;
      this.saveKpiData.total_casos = total;

      this.pt.saveKpi(this.saveKpiData).subscribe({
        next: (data) => {
          // //console.log("data", data.data!);
         // this.data = data;
          this.saveForm.reset();
        },
        error: (err) => {
          // //console.log("error", err);
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
        // //console.log("results", results);
        const { data } = results;
        this.kpisList = data?.chart || [];
        // //console.log("data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data?.chart.length);
        const totals: { [key: string]: number } = {};
        data?.chart.forEach(element => {
          totals[element.kpi] = (totals[element.kpi] || 0) + element.total_casos;
        });
        const labels: string[] = [];
        const res: number[] = [];
        Object.keys(totals).forEach(kpiName => {
          labels.push(`${kpiName} (${totals[kpiName]})`);
          res.push(totals[kpiName]);
        });
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

    

    this.optionKpi = [
      {icon: 'pi pi-chart-bar', name: 'Procedimientos iniciados', value: 1, },
      {icon: 'pi pi-chart-line', name: 'Procedimientos concluidos', value: 2},
      {icon: 'pi pi-chart-pie', name: 'Procedimientos canalizados', value: 3},     
  ];
  }
  cambiaData(event: any) {
    ////console.log("event", event);
  }

  openEditDialog(kpi: chart) {
    this.selectedKpiId = kpi.id || '';
    const selectedOption = this.optionKpi.find(opt => opt.name === kpi.kpi);
    this.editForm.setValue({
      typeCase: selectedOption || '',
      total: kpi.total_casos
    });
    this.displayEditDialog = true;
  }

  saveEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const { typeCase, total } = this.editForm.value;
    const input = {
      id: this.selectedKpiId,
      kpi: typeCase.name,
      description: typeCase.name,
      total_casos: Number(total),
      updatedAt: new Date()
    };
    this.pt.updateKpi(this.selectedKpiId, input).subscribe({
      next: () => {
        this.displayEditDialog = false;
        this.ms.add({ severity: 'success', summary: 'Éxito', detail: 'Estadística actualizada correctamente' });
        this.loadKpis();
      },
      error: () => {
        this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la estadística' });
      }
    });
  }

  confirmDelete(event: Event, kpi: chart) {
    this.confirmationService.confirm({
      target: event.target!,
      message: `¿Estás seguro de que querés eliminar el registro de ${kpi.kpi} con ${kpi.total_casos} casos?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pt.deleteKpi(kpi.id || '').subscribe({
          next: () => {
            this.ms.add({ severity: 'success', summary: 'Éxito', detail: 'Estadística eliminada correctamente' });
            this.loadKpis();
          },
          error: () => {
            this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la estadística' });
          }
        });
      }
    });
  }
}
