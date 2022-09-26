import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { cdoSaveEthic, kpiByEnteQueryInput, updateCdoEthic } from '../../models/kpis.interface';
import { ProtectedService } from '../../services/protected.service';

@Component({
  selector: 'app-adm-plt-codigo-etica',
  templateUrl: './adm-plt-codigo-etica.component.html',
  styleUrls: ['./adm-plt-codigo-etica.component.scss'],
  providers: [ MessageService ]
})
export class AdmPltCodigoEticaComponent implements OnInit, OnChanges {
  idEnteAuth: string =this.asr.idEnteAuth;
  btnMessage: string = "";
  isSaved: boolean = false;
  existsCdo: boolean = false;
  cdoEthic: updateCdoEthic = {} as updateCdoEthic;
  
  constructor(
    private asr: AuthService, 
    private msgs: MessageService,
    private ps: ProtectedService
  ) { }
  
  ngOnInit(): void {
    this.loadCdoEthic(this.idEnteAuth);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadCdoEthic(this.idEnteAuth);
  }



  display: boolean = false;
  showDialog() {
    this.display = true;
  }

  loadCdoEthic(ente: string){

    const ente_publico:kpiByEnteQueryInput = {
      ente_publico: ente //"631b660356c7051a8805004b"//
     }
   
    const cdoEthic = this.ps.loadCdoEthic(ente_publico).subscribe({
      next: (result) => {
        console.log(result);
        if (result.data?.cdo.description){
          this.btnMessage= result.data?.cdo.description!;
          this.existsCdo=true;
        }
      },
      error: (err) => {
            this.btnMessage= err.message;
            this.existsCdo=false;
      },
      complete: () => {
        //console.log("Termine");
      }
    });

  }

  saveCdo( cdo:cdoSaveEthic ){
    cdo.ente_publico= this.idEnteAuth;

    this.ps.registerCdoEthica(cdo).subscribe({
      next: (result) => {
        console.log(result);
        if(result.data?.cdo.id !== null && result.data?.cdo.id !== undefined){
          this.isSaved = true;
          this.showMessageDinamic( 'success', 'Éxito', 'Usuario registrado correctamente...');
        }
      },
      error: (err) => {
        console.log(err);        
          this.showMessageDinamic( "error", 'Error',err);
          this.isSaved = false;
      },
      complete: () => {
        this.loadCdoEthic(this.idEnteAuth);
      }
    });

    console.log("in save",cdo);
  }


  showMessageDinamic(severity:string ,summary: string, detail: string) {
    this.msgs.add({ severity, summary, detail}); //<-- Mensaje de error
  }

}
