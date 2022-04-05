import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { deletePlanWork, planWork, planWorkDataAdd } from '../models/plan-work.interface';
import { kpiAdd, kpiByEnteQueryInput, resp } from '../models/kpis.interface';

@Injectable({
  providedIn: 'root'
})
export class ProtectedService {

  constructor(private apollo:Apollo ) { }


  savePlwd(planWorkDataAdd: planWorkDataAdd): Observable<MutationResult> {
    // console.log(planWorkDataAdd);
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
    // console.log(planWorkDataupdate,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>planWorkDataupdate");
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
    // console.log(planWorkDataDelete);
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
    // console.log(kpiDataAdd);
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







}
