import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { Colaborador, DataColaborador, user_edit, delete_user, President } from '../models/colaborador.interface';

import { items, menu, params_menu } from '../models/menu_interface';
import { findPresident, RegisterColaborador, registerMember, registerPresident, UpdateColaborador } from '../models/register-colaborador.iterface';

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
     this.clean_menu();
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
            routerLink: element.routerLink,
            queryParams: {},

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

  save_Member(colaborador:Colaborador): Observable<MutationResult<registerMember>> {
    colaborador.phone = colaborador.phone.toString();    
    const SAVE_COLABORADOR = 
    gql`mutation addMember($colaborador:EthicsCommitteMemberRegisterInput!)
      {
        registerMember(input:$colaborador){
          id
          email       
        }
      }`;

return this.apollo.mutate<registerMember>({
 mutation: SAVE_COLABORADOR,
 variables: {
   colaborador
 },
 fetchPolicy: 'no-cache'
});
}


save_President(colaborador:Colaborador, ente_publico:string): Observable<MutationResult<registerPresident>> {
  colaborador.phone = colaborador.phone.toString();
  const president:President ={
    email:colaborador.email,
    ente_publico,
    name:colaborador.name,
    phone: colaborador.phone
  }
  console.log(president);     
  const SAVE_COLABORADOR = 
  gql`mutation addPresident($president:EthicsCommitteRegisterInput!){
    registerPresident(input:$president){
      email
      id
    }
  }`;

return this.apollo.mutate<registerPresident>({
mutation: SAVE_COLABORADOR,
variables: {
  president
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

  update_Member(colaborador:user_edit): Observable<MutationResult<UpdateColaborador>> {   
    colaborador.phone = colaborador.phone.toString();    
    const UPDATE_COLABORADOR = 
    gql`mutation updateColaborador($colaborador:UserUpdateColaboradorInput!)
      {
        updateColaborador:updateColaboradorCmm(input:$colaborador){
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

  delete_member(user:delete_user): Observable<MutationResult<delete_user>> {
    const DELETE_USER = 
    gql`mutation inactivateUserCmm($user:UserDeleteInput!){
      inactivateUserCmm(input:$user){
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

   get_menu_portal(params:params_menu, queryParametes:object):items[]{
    this.clean_menu();
     console.log("params", params,"queryParams",queryParametes);
     const GET_MENU_PORTAL = gql`query da_menu_portal($params:MenuQueryInput!){
      items:getMenuByType(input:$params){
        label
        icon
        routerLink
      }  
    }`;
      this.apollo.query<menu>({
        query: GET_MENU_PORTAL,
        variables: {
          params
        },
        fetchPolicy: 'no-cache'
      }).pipe().subscribe(({data})=>{
        console.log(data.items);
        if(this.items.length === 0){
          data.items.forEach(element => {
            if(element.label == "Iniciar Sesión"){
            this.items.push({
              label: element.label,
              icon: element.icon,
              routerLink: element.routerLink,
              queryParams: queryParametes,
            });
            }else{
              this.items.push({
                label: element.label,
                icon: element.icon,
                routerLink: element.routerLink,
                queryParams: queryParametes,
              });
            }
          });
        }

      });
      
      console.log("items DESPUES DE CONSULTAR", this.items);
      return this.items;
    }

   get_president(ente_publico: string): Observable<MutationResult<findPresident>> {
    
   
    const GET_PRESIDENT = gql`{
      PresidetByEnte(input:"${ente_publico}"){
        id
      }
    }`;

   return  this.apollo.query<findPresident>({
      query: GET_PRESIDENT,
      
      fetchPolicy: 'no-cache'
    })

    

  }










  
}
