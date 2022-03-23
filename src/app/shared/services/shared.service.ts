import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { items, menu } from '../models/menu_interface';

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
}
