import { Injectable, Input } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {Apollo, gql, MutationResult} from 'apollo-angular';

import {data, TreeColaboradores} from '../interfaces/user_token.interface';

import { items } from 'src/app/shared/models/menu_interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private _user_token: data |undefined;  
  private _menu:items[] = [];
  private _defaultMenu:items[] = [];

  public role:string = '';

  get isLoggedIn(): data |undefined  {
    return { ...this._user_token! };
  }

  get idUserAuth():string{
    return this._user_token?.verify_authentication.user.id!;
  }

  get idEnteAuth():string{
    return this._user_token?.verify_authentication.user.ente_publico!;
  }

  get dmenu():items[]{
    return this._menu;
  }

  get menuDefault():items[]{
    return this._defaultMenu = this.sharedService.get_menu('user');
  }

  saveRole(role:string){
    const SAVE_ROLE = role;
    this.role = SAVE_ROLE;
  }


  constructor( private apollo:Apollo, private sharedService:SharedService  ) {    
  }

  logout() {
    this._user_token = undefined;
    this.apollo.client.resetStore();
    this._menu = [];
    this.sharedService.clean_menu();
  }

   login(email?: string, password?: string): Observable<MutationResult<data>> {
    
    let res = new Observable<MutationResult<data>>();
    try {
     
    const LOGIN_POST = gql`mutation login($input: LoginAuthInput!) 
                            {
                              login(input:$input)
                               {
                                haveError
                                Err
                                token
                                user{
                                  id
                                  name
                                  email
                                  password
                                  avatar  
                                  role
                                  colaboradores
                                  ente_publico                         
                                  }
                                }
                            }`;
     res = this.apollo.mutate<data>({
      mutation: LOGIN_POST,
      variables: {
        "input": {
          "email": email,
          "password": password
        }
      }     
    }).pipe(       
      tap( auth => { this._user_token = auth.data!; }),
      tap( auth => {       
        localStorage.setItem('token', this._user_token?.login.token!); 
        this.saveRole(this._user_token?.login.user.role!);
        this._menu = this.sharedService.get_menu( this.role ); 
      }),
    );
   
    return res;
  } catch (error) {
      // console.log('catch in try',error);
      return res;
    }
  }


  verify_authentication():Observable<boolean>{

    try {

      if(!localStorage.getItem('token')){
        return of(false);
      }
     
      const VERIFY_AUTENTICATION = gql` query verify_authentication($token: String!) { 
                                                verify_authentication (token:$token)
                                                {
                                                  haveError
                                                  Err
                                                  token
                                                  user{
                                                    id
                                                    name
                                                    email
                                                    password
                                                    avatar
                                                    role
                                                    colaboradores
                                                    ente_publico                                                                                    
                                                    }
                                                  }
                                              }`;

      return this.apollo.query<data>({
        query: VERIFY_AUTENTICATION,
        variables: {
          "token": localStorage.getItem('token')
        },
        errorPolicy: 'all'
      }).pipe(
        map( auth => {
          if(auth.data)
          {            
          this._user_token = auth.data!; 
         // console.log('verify_authentication',this._user_token.verify_authentication.user.role);
          this.saveRole(this._user_token.verify_authentication.user.role);
          if(this.role)
            {
              
            }else
            {
              this.role = 'user';
             
            }  
            this._menu = this.sharedService.get_menu( this.role );     
          return !auth.data?.verify_authentication.haveError;
          }else
          {
            return false;
          }
        }),
      );     
      
    } catch (error) {
      // console.log('catch in try',error);
      return of(false);
    }   
   
  }

   get_tree_colaboradores(boss: filterBoss | filterEnte):Observable<MutationResult<TreeColaboradores>>{

     
    
      const GET_TREE_COLABORADORES = gql` query getColaboresTreeData($boss:UserColaboradoresQueryInput!){
        getColaboresTreeData(input:$boss){
          label
          type
          styleClass
          expanded
          id
          name
          charge
          phone
          email
          data{            
            name
            avatar
          }
          children{     
            label
            type
            styleClass
            expanded
            id
            name
            charge
            phone
            email
            data{              
              name
              avatar
            }
            
          }
        }
      }`;
      
      const res = this.apollo.query<TreeColaboradores>({ 
        query: GET_TREE_COLABORADORES,
        variables: boss,
        errorPolicy: 'all'
      });

     
    
    return res;
   
  }
  
}
