import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { kpiByEnteQueryInput } from 'src/app/protected/models/kpis.interface';
import { ProtectedService } from 'src/app/protected/services/protected.service';
import { OicEnte, OicInterface } from '../../models/oic.interface';

import { filterBoss, filterEnte } from '../../models/tree.interface';

@Component({
  selector: 'app-plt-codigo-etica',
  templateUrl: './plt-codigo-etica.component.html',
  styleUrls: ['./plt-codigo-etica.component.scss'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PltCodigoEticaComponent  {

 
  filter: filterBoss | filterEnte | null = null; 
  display: boolean = false;
  name_ente: string = "";
  url: string = "";
 

  constructor(   
    private readonly ms: MessageService,
    private readonly ps: ProtectedService
  ) { } 
  
  showError() {
    this.ms.add({ severity: 'info', summary: 'Información', detail: 'No hay datos del ente solicitado...' });   //<-- Mensaje de error
  }

  showCodigo($event: OicEnte) {    
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>ShowCod", $event);
    if($event.ente.id=="624c8e3daddddcbcb26e8135"){
      this.display = true;
      this.name_ente = $event.ente.nombre_ente;
      return;
    }
    this.display = false;
    this.showError();
  }

  showCodigo2($event: OicInterface) {
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> ShowCod2", $event.id, $event.id.includes("622a42575fd04394d83e0702"));
    const { id, nombre_ente } = $event
    const ente:kpiByEnteQueryInput = { ente_publico:id } as kpiByEnteQueryInput;

    this.loadCdoByEnte(ente, nombre_ente);
    
  }

  loadCdoByEnte(ente:kpiByEnteQueryInput, nombre_ente:string){
 console.log(ente, nombre_ente);
    this.ps.loadCdoEthic(ente).subscribe({
      next: (result) => {
        console.log(result);
        const { data } = result;
        if(data !== undefined && data !== null){
          this.display = true;
          this.name_ente = nombre_ente;
          this.url= data.cdo.url;
          return;
        }
      },
      error: (err) => {
        console.log(err);
        this.display = false;
        this.showError();
      },
      complete: () => {
        console.log('complete')
      }
    });


  }

}
