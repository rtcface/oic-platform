import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { MenuItem } from 'primeng/api';

import { items } from '../models/menu_interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor( private apollo:Apollo) { }

  get_menu():any{
    const GET_MENU = gql`query{
                           items{
                              label
                              icon
                              routerLink
                            }
                          }`;
     this.apollo.query<items>({
      query: GET_MENU,
      fetchPolicy: 'no-cache'
    }).pipe((data) => {
      return data;
      }).subscribe(({data}) => {
        console.log(" DATA DESDE GRAPHQL",data);
      });

  

    
  }
}
