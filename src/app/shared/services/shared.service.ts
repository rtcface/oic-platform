import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { Colaborador, DataColaborador, user_edit, delete_user } from '../models/colaborador.interface';

import { items, menu } from '../models/menu_interface';
import { RegisterColaborador, UpdateColaborador } from '../models/register-colaborador.iterface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isLoading$ = new Subject<boolean>();

  showLoading(): void {
    this.isLoading$.next(true);
  }

  hideLoading(): void {
    this.isLoading$.next(false);
  }

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

  update_Colaborador(colaborador:user_edit): Observable<MutationResult<UpdateColaborador>> {
    colaborador.name = colaborador.name.toUpperCase();
    colaborador.charge = colaborador.charge.toUpperCase();
    colaborador.phone = colaborador.phone.toString();    
    const UPDATE_COLABORADOR = 
    gql`mutation updateColaborador($colaborador:UserUpdateColaboradorInput!)
      {
        updateColaborador(input:$colaborador){
          haveError    
          Err       
        }
      }`;

   return this.apollo.mutate<UpdateColaborador>({
     mutation: UPDATE_COLABORADOR,
     variables: {
       colaborador
     },
     fetchPolicy: 'no-cache'
   });
  }

  delete_user(user:delete_user): Observable<MutationResult<delete_user>> {
    const DELETE_USER = 
    gql`mutation deleteUser($user:UserDeleteInput!){
      inactivateUser(input:$user){
        id
      }
    }`;

   return this.apollo.mutate<delete_user>({
     mutation: DELETE_USER,
     variables: {
       user
     },
     fetchPolicy: 'no-cache'
   });
  }



  
}
