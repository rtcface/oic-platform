import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import {  history_update } from 'src/app/shared/models/history.interface';
import { kpiByEnteQueryInput } from '../../models/kpis.interface';
import { ProtectedService } from '../../services/protected.service';
import { history_init } from '../../../shared/models/history.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-plt-rules',
  templateUrl: './adm-plt-rules.component.html',
  styleUrls: ['./adm-plt-rules.component.scss'],
  providers: [MessageService],
})
export class AdmPltRulesComponent implements OnInit {
  data:history_update = { } as history_update;
  ent:kpiByEnteQueryInput = {} as kpiByEnteQueryInput;

  constructor(  
    private readonly auServ: AuthService,
    private readonly ps: ProtectedService,
    private readonly ms: MessageService,
    ) { }

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(){
    this.ent.ente_publico = this.auServ.idEnteAuth;
    this.ps.getIntegrationRules(this.ent).subscribe({
    next: (result) => {
      if (result.data?.rules[0] !== null && result.data?.rules[0] !== undefined) {        
        this.data = result.data?.rules[0]!;
        console.log("in the parent",this.data);
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ",this.data);
      } else {
        const register:history_init={
          ente_publico: this.ent.ente_publico
         }        
        this.ps.initRules(register).subscribe(
          {
            next:(result) => {
              console.log(result);
            },
            error(err) {
                console.log(err);
            },
            complete: () => {             
              this.loadRules();
            }
          }
        );        
      }      
    },  
    error: (err) => {
       console.log("error", err);
    },
    complete: () => {
       console.log('compleate')
      }
   });

  }

  saveSubmit(ruleSave:history_update){  
   
    this.ps.updateRules(ruleSave).subscribe({
      next: (result) => {

        if(result.data !== null ){
          this.showMessageDinamic( "success", 'Actualización', 'Las reglas de integracion se actualizaron correctament...');
        }else{
          this.showMessageDinamic( "error", 'Error', 'Algo sali mal ;-(');
          console.log(`Err ${result.errors}`);
        }        
      
      }, error: (err) => {
        this.showMessageDinamic( "error", 'Error', 'Algo sali mal ;-(');
         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      },
      complete: () => {
        this.loadRules();        
      },
    });      
  }


  showMessageDinamic(severity:string ,summary: string, detail: string) {
    this.ms.add({ severity, summary, detail}); //<-- Mensaje de error
  }



}
