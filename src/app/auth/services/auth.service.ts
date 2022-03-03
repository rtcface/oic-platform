import { Injectable } from '@angular/core';
import {Apollo, gql, graphql} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  constructor( private apollo:Apollo  ) { }

  login(email?: string, password?: string) {

    const LOGIN_POST = gql`mutation login($input: LoginAuthInput!) 
    {login(input:$input) { token } }`;
   

    

    return this.apollo.mutate({
      mutation: LOGIN_POST,
      variables: {
        input: {
          email: email,
          password: password
        }
      }     
    });
  }




//   return this.apollo.mutate({
//     mutation: graphql`
//       mutation {
//         login(
//           input:{
//             email: $email, password: $password
//             }) {
//           token
//         }
//       }
//     `
//   });
// }



  
}
