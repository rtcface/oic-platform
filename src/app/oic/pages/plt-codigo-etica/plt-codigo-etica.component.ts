import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
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
 

  constructor(
    private readonly as: AuthService,
    private readonly ms: MessageService
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
    if($event.id.includes("624c8e3daddddcbcb26e8135")){
      //console.log("Entre al if");
      this.display = true;
      this.name_ente = $event.nombre_ente;
      return;
    }
    this.display = false;
    this.showError();
  }

}
