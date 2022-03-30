import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Colaborador, DataColaborador } from '../models/colaborador.interface';

import { items, menu } from '../models/menu_interface';
import { RegisterColaborador } from '../models/register-colaborador.iterface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private items:items[] = [];

  get menuitems():items[]{
    return this.items;
  }
  
  clean_menu(){
    this.items = [];
  }

  constructor( private apollo:Apollo ) { }

    

   get_menu(role:string):items[]{
    const GET_MENU = gql`query getMenuForRole($role: String!)
    {
      items(role:$role)
      {
        label
        icon
        routerLink
      }
    }`;

     this.apollo.query<menu>({
      query: GET_MENU,
      variables: {
        role
      },
      fetchPolicy: 'no-cache'
    }).pipe().subscribe(({data})=>{      
     //console.log(data.items);
      if(this.items.length === 0){
        data.items.forEach(element => {
          this.items.push({
            label: element.label,
            icon: element.icon,
            routerLink: element.routerLink
          });        
        });
      }     
      });

    return this.items;
  

    
  }

    save_Colaborador(colaborador:Colaborador): Observable<MutationResult<RegisterColaborador>> {
        colaborador.name = colaborador.name.toUpperCase();
        colaborador.charge = colaborador.charge.toUpperCase();
        colaborador.phone = colaborador.phone.toString();    
        const SAVE_COLABORADOR = 
        gql`mutation registerColaborador($colaborador:UserColaboradorRegisterInput!)
          {
            registerColaborador(input:$colaborador){
              haveError    
              Err       
            }
          }`;

   return this.apollo.mutate<RegisterColaborador>({
     mutation: SAVE_COLABORADOR,
     variables: {
       colaborador
     },
     fetchPolicy: 'no-cache'
   });
  }

  
}
