import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { history_save } from 'src/app/shared/models/history.interface';
import { kpiByEnteQueryInput } from '../../models/kpis.interface';
import { ProtectedService } from '../../services/protected.service';

@Component({
  selector: 'app-adm-plt-rules',
  templateUrl: './adm-plt-rules.component.html',
  styleUrls: ['./adm-plt-rules.component.scss']
})
export class AdmPltRulesComponent implements OnInit {
  data:history_save = { } as history_save;
  ent:kpiByEnteQueryInput = {} as kpiByEnteQueryInput;

  constructor(  
    private readonly auServ: AuthService,
    private readonly ps: ProtectedService ) { }

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(){
    this.ent.ente_publico = this.auServ.idEnteAuth;
   this.ps.getIntegrationRules(this.ent).subscribe({
    next: (result) => {
      if (result.data?.rules[0] !== null) {        
        this.data = result.data?.rules[0]!;
        //console.log("in the parent",this.data);
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> Desde el load ",this.data);
      } else {
       // this.showMessageDinamic( 'error', 'Información', 'No hay datos del ente solicitado...');
        // this.purgeTree();
      }      
    },  
    error: (err) => {
       console.log("error", err);
    },
    complete: () => {
       console.log("complete",this.data);
    }
   });

  }

  saveSubmit(ruleSave:history_save){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>this",ruleSave);
    this.ps.saveRules(ruleSave).subscribe({
      next: (result) => {
        console.log("Aqui>>>>>>>>>>>>>>>>>>>",result);
      }, error: (err) => {
         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta",err);
      },
      complete: () => {
        this.loadRules();        
      },

    });      

   
  


  }
  

}
