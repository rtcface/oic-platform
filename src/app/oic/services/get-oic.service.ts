import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { OicInterface, OicInterfaceGql } from '../models/oic.interface';
import { tree,filterWpd } from '../models/tree.interface';
import { data } from '../../auth/interfaces/user_token.interface';


@Injectable({
  providedIn: 'root'
})
export class GetOicService {

  constructor( 
    private http: HttpClient,
    private apollo: Apollo
    ) { }
    

  getOic(): Observable<OicInterface> {
    return this.http.get<OicInterface>('assets/db/entes.json');
  }
  getMenu(): Observable<tree> {
    return this.http.get<tree>('assets/db/plan-trabajo.json');
  }

  getOicFromGraph(param:string): Observable<MutationResult<OicInterfaceGql>> {
    const GET_OIC = gql`query GET_ENTE($ente:String!){
  
      items:getEnteByName(name:$ente){
        id,
        nombre_ente,
        siglas_ente
      }
      
    }`;
    return this.apollo.query<OicInterfaceGql>({
      query: GET_OIC,
      variables: {
        ente: param
      },
      fetchPolicy: 'no-cache'
    });
  }




  getWorkPlanFromGraph(ente:filterWpd): Observable<MutationResult<tree>>  {
    const GET_WORK_PLAN = gql`query planwork($ente:PlanWorkQueryInput!){  
           data:getPlanWorkData(input:$ente){
             label
             data
             expandedIcon
             collapsedIcon
             children{
                 label
                 data
                 expandedIcon
                 collapsedIcon      
                 children{
                   label
                   icon
                   url
                }      
             }
           }      
         }`;
    console.log(ente,"este es el ente");
    return this.apollo.query<tree>({
      query: GET_WORK_PLAN,
      variables: ente,     
      errorPolicy: 'all'
    });
  }
  

  // getWorkPlanFromGraph(ente:filterWpd): Observable<MutationResult<tree[]>> {
  //   const GET_WORK_PLAN = gql`query planwork($ente:PlanWorkQueryInput!){  
  //     getPlanWorkData(input:$ente){
  //       label
  //       data
  //       expandedIcon
  //       collapsedIcon
  //       children{
  //           label
  //           data
  //           expandedIcon
  //           collapsedIcon      
  //           children{
  //             label
  //             icon
  //             url
  //           }      
  //       }
  //     }      
  //   }`
  //   console.log(ente,"este es el ente");
  //   return this.apollo.query<tree[]>({
  //     query: GET_WORK_PLAN,
  //     variables: {ente},     
  //     errorPolicy: 'all'
  //   });
  // }









}
