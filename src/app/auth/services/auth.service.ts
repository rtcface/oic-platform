import { Injectable, Input } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {Apollo, gql, MutationResult} from 'apollo-angular';

import {data} from '../interfaces/user_token.interface';
import { SharedService } from '../../shared/services/shared.service';
import { items } from 'src/app/shared/models/menu_interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private _user_token: data |undefined;  
  private _menu:items[] = [];

  get isLoggedIn(): data |undefined  {
    return { ...this._user_token! };
  }

  get dmenu():items[]{
    return this._menu;
  }


  constructor( private apollo:Apollo,
    private sharedService:SharedService  ) {    
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
    this._menu =  this.sharedService.get_menu();

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
        
      }),
    );
    return res;
  } catch (error) {
      console.log('catch in try',error);
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
          this._menu = this.sharedService.get_menu();
         
          return !auth.data?.verify_authentication.haveError;
          }else
          {
            return false;
          }
        }),
      );     
      
    } catch (error) {
      console.log('catch in try',error);
      return of(false);
    }   
   
  }
  
}
