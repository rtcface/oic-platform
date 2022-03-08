import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {Apollo, gql} from 'apollo-angular';

import { login, data } from '../interfaces/user_token.interface';
import { SharedService } from '../../shared/services/shared.service';
import { items } from 'src/app/shared/models/menu_interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private _user_token: login | undefined;
  private _menu:items[] = [];

  get isLoggedIn(): login | undefined {
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

   login(email?: string, password?: string) {
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

    return this.apollo.mutate<login>({
      mutation: LOGIN_POST,
      variables: {
        "input": {
          "email": "rtc12586@gmail.com",
          "password": "123456"
        }
      }     
    }).pipe(
      tap( auth => { this._user_token = auth.data!; }),
      tap( auth => { localStorage.setItem('token', this._user_token?.login!.token!); }),
    );

    
  }


  verify_authentication():Observable<boolean>{

    try {

      if(!localStorage.getItem('token')){
        return of(false);
      }

      //return of(true);
      
      const VERIFY_AUTENTICATION = gql` query { verify_authentication }`;
  
      return this.apollo.query<{verify_authentication:boolean}>({
        query: VERIFY_AUTENTICATION,
        errorPolicy: 'all'
      }).pipe(
        map( auth => { 
          console.log(auth.data);
          console.log(auth.data.verify_authentication);
          this._menu =  this.sharedService.get_menu();
          if(auth.data.verify_authentication)
            return true;
          else
            return false;         
        })
      );
      
      
    } catch (error) {
      console.log('catch in try',error);
      return of(false);
    }   
   
  }
  
}
