import { Injectable } from '@angular/core';
import {Apollo, gql, graphql} from 'apollo-angular';
import { login, data } from '../interfaces/user_token.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private _user_token: login | undefined;

  get isLoggedIn(): login | undefined {
    return { ...this._user_token! };
  }

  constructor( private apollo:Apollo  ) { }

  login(email?: string, password?: string) {
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
      tap( resp => {        
        this._user_token = resp.data!;
        console.log("desde el servicio",this._user_token.login);
      })
    );
  }
  
}
