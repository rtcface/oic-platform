import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { OicInterface, OicInterfaceGql } from '../models/oic.interface';
import { tree } from '../models/tree.interface';
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






}
