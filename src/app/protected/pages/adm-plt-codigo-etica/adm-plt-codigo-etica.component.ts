import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { cdoSaveEthic, delete_cdo, kpiByEnteQueryInput, updateCdoEthic } from '../../models/kpis.interface';
import { ProtectedService } from '../../services/protected.service';

@Component({
  selector: 'app-adm-plt-codigo-etica',
  templateUrl: './adm-plt-codigo-etica.component.html',
  styleUrls: ['./adm-plt-codigo-etica.component.scss'],
  providers: [ MessageService ],
})
export class AdmPltCodigoEticaComponent implements OnInit, OnChanges {
  idEnteAuth: string =this.asr.idEnteAuth;
  btnMessage: string = "";
  isSaved: boolean = false;
  isSave: boolean = false;
  existsCdo: boolean = false;
  btnEditCdo: boolean = true;
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
    console.log("en el load",ente );
    const ente_publico:kpiByEnteQueryInput = {
      ente_publico: ente //"631b660356c7051a8805004b"//
     }
   
    const cdoEthic = this.ps.loadCdoEthic(ente_publico).subscribe({
      next: (result) => {
        console.log(result);
        if (result.data?.cdo.description){

          this.cdoEthic.description = result.data?.cdo.description!
          this.cdoEthic.url = result.data?.cdo.url!;
          this.cdoEthic.id = result.data?.cdo.id!;

          this.btnMessage= this.cdoEthic.description;
          this.existsCdo=true;
          this.btnEditCdo=false;
        }
      },
      error: (err) => {
            this.btnMessage= err.message;
            this.existsCdo=false;
      },
      complete: () => {
        console.log("Termine");
      }
    });

  }

  saveCdo( cdo:cdoSaveEthic ){
    const save: cdoSaveEthic = { description:cdo.description, url:cdo.url, ente_publico: this.idEnteAuth} as cdoSaveEthic;
    this.ps.registerCdoEthica(save).subscribe({
      next: (result) => {
        console.log(result);
        if(result.data?.cdo.id !== null && result.data?.cdo.id !== undefined){
          this.isSaved = true;
          this.showMessageDinamic( 'success', 'Éxito', 'Código de Ética registrado correctamente...');
        }
      },
      error: (err) => {
        //console.log(err);        
          this.showMessageDinamic( "error", 'Error',"Al parecer hay error");
          this.isSaved = false;
      },
      complete: () => {
        this.loadCdoEthic(this.idEnteAuth);
      }
    });

    //console.log("in save",cdo);
  }


  showMessageDinamic(severity:string ,summary: string, detail: string) {
    this.msgs.add({ severity, summary, detail}); //<-- Mensaje de error
  }

  updateCdoData(cdo:updateCdoEthic ) {   
    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el update ",cdo);
    this.cdoEthic = cdo;

   
    // //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el this update ",this.userEdit);
    this.showDialog();
  }

  delete(cdo: delete_cdo) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el delete ",cdo);
    this.ps.delete_cdo(cdo).subscribe({
      next: (result) => {
        //console.log(result.data?.cdo.id);
        if (result.data?.cdo.id) {
          this.showMessageDinamic( 'success', 'Información', 'Código de Ética eliminado correctamente...');        
          this.btnEditCdo=true;
        } else {
          this.showMessageDinamic( 'error', 'Error', 'No se pudo eliminar...');
        }
      },
      error: (err) => {
        // //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
        this.showMessageDinamic( 'error', 'Error', 'No se pudo eliminar...');
      },
      complete: () => {
        this.loadCdoEthic(this.idEnteAuth);
        this.display = false;
      },
    });
  }

  update(cdo:updateCdoEthic){
    const data:updateCdoEthic = {description:cdo.description,id:cdo.id,url:cdo.url} as updateCdoEthic ;
    console.log(data,"in update");
    this.ps.update_cdo(data).subscribe({
      next:(result) => {
        console.log(result);
        if(result.data?.cdo.id !== null && result.data?.cdo.id !== undefined){
          this.showMessageDinamic( 'success', 'Éxito', 'Código de Ética registrado correctamente...');
        }
      },
      error:(err) =>{
        console.log(err);
        this.showMessageDinamic( 'error', 'Error', 'Ups al parecer hubo un error... '+err.message);
      },
      complete:() => {
        this.loadCdoEthic(this.idEnteAuth);
        this.display = false;
      }
    });

  }




}