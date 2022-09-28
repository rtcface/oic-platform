import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { deletePlanWork, planWork, planWorkDataAdd } from '../models/plan-work.interface';
import { cdo, cdoSaveEthic, delete_cdo, kpiAdd, kpiByEnteQueryInput, requestCdo, resApiAddCdo, resp, updateCdoEthic } from '../models/kpis.interface';
import {  history_init, history_update, rules } from 'src/app/shared/models/history.interface';

@Injectable({
  providedIn: 'root'
})
export class ProtectedService {

  constructor(private apollo:Apollo ) { }


  savePlwd(planWorkDataAdd: planWorkDataAdd): Observable<MutationResult> {
    // //console.log(planWorkDataAdd);
    const SAVE_PLWD = gql`mutation addPlan($planWorkDataAdd:PlanWorkChildRegisterInput!){
      addPlanWorkChild(input:$planWorkDataAdd){
        id        
      }
    }`;
    return this.apollo.mutate({
      mutation: SAVE_PLWD,
      variables: {
        planWorkDataAdd
      },
      fetchPolicy: 'no-cache'
    });
  }

  updatePlwd(planWorkDataupdate: planWork): Observable<MutationResult> {
    // //console.log(planWorkDataupdate,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>planWorkDataupdate");
    const UPDATE_PLWD = gql`mutation update($planWorkDataupdate:PlanWorkChildUpdate!){
      updatePlanWorkChild(input:$planWorkDataupdate){
        id
      }
    }`;
    return this.apollo.mutate({
      mutation: UPDATE_PLWD,
      variables: {
        planWorkDataupdate
      },
      fetchPolicy: 'no-cache'
    });
  }

  deletePlwd(planWorkDataDelete: deletePlanWork): Observable<MutationResult> {
    // //console.log(planWorkDataDelete);
    const DELETE_PLWD = gql`mutation inactivePw($planWorkDataDelete:PlanWorkDeleteInput!){
      inactivatePlanWork(input:$planWorkDataDelete){
        id
      }
    }`;
    return this.apollo.mutate({
      mutation: DELETE_PLWD,
      variables: {
        planWorkDataDelete
      },
      fetchPolicy: 'no-cache'
    });
  }

  // methods for kpis register

  saveKpi(kpiDataAdd: kpiAdd): Observable<MutationResult> {
    // //console.log(kpiDataAdd);
    const SAVE_KPI = gql`mutation addKpis($kpiDataAdd:KpisRegisterInput!){  
      addKpis(input:$kpiDataAdd){
        id   
      }  
    }`;
    return this.apollo.mutate({
      mutation: SAVE_KPI,
      variables: {
        kpiDataAdd
      },
      fetchPolicy: 'no-cache'
    });
  }

  // method kpis  for chart
  getKpis(ente_publico:kpiByEnteQueryInput): Observable<MutationResult<resp>> {
    const GET_KPIS = gql`query getKpiByEnte($ente_publico:KpisByEnteQueryInput!){
      chart:getKpisByEnte(input:$ente_publico){
        kpi
        total_casos
      }
    }`;
    return this.apollo.query<resp>({
      query: GET_KPIS,
      variables: {
        ente_publico
      },
      fetchPolicy: 'no-cache'
    });
  }

  // get method Integration Rules

  getIntegrationRules(ente_publico:kpiByEnteQueryInput): Observable<MutationResult<rules>> {
    const GET_RULES = gql`query getHistoryRules($ente_publico: HistoryRuleByEnteInput!){
      rules:getHistoryIntegrityRulesByEnte(input:$ente_publico){
       id
       ente_publico
       p1
       p2
       p3
       p4
       p5
       p6
       p7
       p8
       p9
       p10
       p11
       p12
       p13
       p14
       p15
       p16
     }
     }`;
      return this.apollo.query<rules>({
        query: GET_RULES,
        variables: {
          ente_publico
        },
        fetchPolicy: 'no-cache'
      });

  }

   // methods for update rules

   updateRules(history:history_update): Observable<MutationResult> {
      const { ente_publico, ...rest} = history;  
        const SAVE_RULE = gql`mutation updateHistory($rest:IntegrityRuleHistoryUpdateInput!){
       updateHistoryRules(input:$rest){   
       ente_publico     }
    }`;
    return this.apollo.mutate({
      mutation: SAVE_RULE,
      variables: {
        rest
      },
      fetchPolicy: 'no-cache'
    });
  }

  initRules(register:history_init): Observable<MutationResult> {
    const INIT_RULE = gql`mutation registerHistory($register:IntegrityRuleHistoryInput!){
      registerHistoryRules(input:$register){
        ente_publico        
      }
    }`;
    return this.apollo.mutate({
      mutation: INIT_RULE,
      variables: {
        register
      },
      fetchPolicy: 'no-cache'
    });
    
  }

  loadCdoEthic(ente:kpiByEnteQueryInput): Observable<MutationResult<requestCdo>>{
    const { ente_publico }=ente;
    const LOAD_CDO_ETHIC = gql`query getCdoEthic{
      cdo:getCdoEthicByEnte(ente_publico:"${ente_publico}"){
        id
        description
        url
        ente_publico        
      }
    }`;
    return this.apollo.query<requestCdo>({
      query: LOAD_CDO_ETHIC,
      fetchPolicy: 'no-cache'
    });
  }

  registerCdoEthica(cdo:cdoSaveEthic): Observable<MutationResult<cdo>> {
    const REGISTER_CDO = gql`mutation addcdoEthic($cdo:CodeEthicsRegisterInput!){
      cdo:addCodeEthics(input:$cdo){
        id
      }
    }`;
    return this.apollo.mutate<cdo>({
      mutation: REGISTER_CDO,
      variables: {
        cdo
      },
      fetchPolicy: 'no-cache'
    });
    
  }

  delete_cdo(cdo:delete_cdo): Observable<MutationResult<cdo>>{
    const DELETE_CDO_ETHIC = gql`mutation delete_cdo($cdo: CodeEthicsDeleteInput!){
      cdo:deleteEthicCode(input:$cdo){
        id
      }
    }`;
    return this.apollo.mutate<cdo>({
      mutation: DELETE_CDO_ETHIC,
      variables: {
        cdo
      },
      fetchPolicy: 'no-cache'
    });
    




  }

  update_cdo(cdo:updateCdoEthic): Observable<MutationResult<cdo>> {
     console.log(cdo, 'update in PS')
     
     
    const UPDATE_CDO_ETHIC = gql`mutation updateCdoEthic($cdo:CodeEthicsUpdateInput!)
    {
      cdo:updateCodeEthics(input:$cdo){
            id            			  
      }
    }`;

    return this.apollo.mutate<cdo>({
      mutation: UPDATE_CDO_ETHIC,
      variables:{
        cdo
      },
      fetchPolicy: 'no-cache'
    });

  }
  
}
