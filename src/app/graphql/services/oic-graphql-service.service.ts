import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { GET_ENTES_PUBLICOS } from '../graphql-constans';
import { ente, entesRequest } from '../interfaces/graphql-model';
import { GraphqlService } from '../interfaces/oic-graphql-model';

@Injectable({
  providedIn: 'root',
})
export class OicGraphqlServiceService implements GraphqlService {
  constructor(private readonly apollo: Apollo) {}
  
  getNamesEntes(): Observable<string[]> {
    console.log("in service");
    const listName:string[] = [];
    return this.apollo
    .query<entesRequest>({ query: GET_ENTES_PUBLICOS })
    .pipe(map((m) => {
      console.log("in service", m.data.entes);
      
        m.data.entes.map((ent) => listName.push(ent.nombre_ente));
       return listName;
    }));    
  }
  
  getEntes(): Observable<ente[]> {
    return this.apollo
      .query<entesRequest>({ query: GET_ENTES_PUBLICOS })
      .pipe(map((m) => {
        console.log(m)
        return m.data.entes
      }));
  }

  


}
