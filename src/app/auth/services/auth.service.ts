import { Injectable, Input } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {Apollo, gql, MutationResult} from 'apollo-angular';

import {data, TreeColaboradores} from '../interfaces/user_token.interface';

import { items, params_menu } from 'src/app/shared/models/menu_interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { change_password, filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  queryParams:object={
    ['page']: 'oic'
  };
  
  params: params_menu = {
    portal: 'oic',
    role: 'user'
  }

  private _user_token: data |undefined;
  private _menu:items[] = [];
  private _defaultMenu:items[] = [];

  public role:string = 'user';

  get isLoggedIn(): data |undefined  {
    return { ...this._user_token! };
  }

  get idUserAuth():string{
    return this._user_token?.verify_authentication.user.id!;
  }

  get getEmail():string{
    return this._user_token?.login.user.email!;
    
  }

  get idEnteAuth():string{
    return this._user_token?.verify_authentication.user.ente_publico!;
  }

  get da_role():string{
    return this.role;
  }

  get dmenu():items[]{
    return this._menu;
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

   login(email?: string, password?: string, portal?: string): Observable<MutationResult<data>> {
   
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
          firstSignIn
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
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      tap( auth => { this._user_token = auth.data!; }),
      tap( auth => {
        this.params.role=this._user_token?.login.user.role!;
        this.params.portal=portal!;
        localStorage.setItem('token', this._user_token?.login.token!);
        localStorage.setItem('portal', portal!);
        this.saveRole(this.params.role);
        this._menu = this.sharedService.get_menu_portal( this.params, this.queryParams );
      }),
    );

    return res;
  } catch (error) {
      // //console.log('catch in try',error);
      return res;
    }
  }

   change_password(usePass:change_password): Observable<MutationResult<data>> {
    
    let request = new Observable<MutationResult<data>>();
    
    //console.log("desde el auth service");
    if (!this.verify_authentication()) {
      //console.log('Data desde la autentication');
      //TODO: add edirect to login
      }
      
      try {
        usePass.usePass.email = this.getEmail;
        //console.log('Data desde el try');      
        const CHANGE_PASS = gql`mutation changePass($usePass:UserChangePassInput!){
          login:changePassword(input:$usePass){
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
              firstSignIn
              }
          }
        }`;
       request = this.apollo.mutate<data>({
          mutation: CHANGE_PASS,
          variables: usePass ,
         fetchPolicy: 'no-cache'
        });
        //console.log(request);
        return request;     
      } catch (error) {
        //console.log('error=>',error);
        return request;
      }

     
   }


  verify_authentication():Observable<boolean>{

    try {

      if(!localStorage.getItem('token') || !localStorage.getItem('portal')){
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
        errorPolicy: 'all',
        fetchPolicy: 'no-cache'
      }).pipe(
        map( auth => {
          if(auth.data)
          {
          this._user_token = auth.data!;
          ////console.log('verify_authentication',this._user_token.verify_authentication.user.role);
          this.params.role=this._user_token.verify_authentication.user.role;
          this.params.portal=localStorage.getItem('portal')!;
          this.saveRole(this.params.role);
          if(this.role)
            {

            }else
            {
              this.role = 'user';
            }
            this._menu = this.sharedService.get_menu_portal( this.params, this.queryParams );
          return !auth.data?.verify_authentication.haveError;
          }else
          {
            return false;
          }
        }),
      );

    } catch (error) {
      // //console.log('catch in try',error);
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
        errorPolicy: 'all',
        fetchPolicy: 'no-cache'
      });



    return res;

  }

  get_tree_comite(boss: filterBoss | filterEnte):Observable<MutationResult<TreeColaboradores>>{



    const GET_TREE_COLABORADORES = gql` query getCommitteMembesTreeData($boss:CommitteColaboradoresQueryInput!){
      TreeColaboradoresData:getCommitteMembesTreeData(input:$boss){
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
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    });



  return res;

}

}
