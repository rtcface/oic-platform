import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { catchError, Observable, of, Subject, Subscription, tap } from 'rxjs';
import {
  Colaborador,
  DataColaborador,
  user_edit,
  delete_user,
  President,
} from '../models/colaborador.interface';
import {
  entesRequest,
  staditics_request,
  history_init,
  staditics,
  dataset,
  ente,
  Data,
  GraphqlRequest,
} from '../models/history.interface';

import { items, menu, params_menu } from '../models/menu_interface';
import { data } from 'src/app/auth/interfaces/user_token.interface';
import { Graficas } from '../models/history.interface';
import {
  findPresident,
  RegisterColaborador,
  registerMember,
  registerPresident,
  UpdateColaborador,
} from '../models/register-colaborador.iterface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  isLoading$ = new Subject<boolean>();

  showLoading(): void {
    this.isLoading$.next(true);
  }

  graficaReload():void{
    
  }

  hideLoading(): void {
    this.isLoading$.next(false);
  }

  private items: items[] = [];
  private namesEntesList : ente[] = [];

  get menuitems(): items[] {
    return this.items;
  }

  clean_menu() {
    this.items = [];
  }

  constructor(private apollo: Apollo) {}

  get_menu(role: string): items[] {
    this.clean_menu();
    const GET_MENU = gql`
      query getMenuForRole($role: String!) {
        items(role: $role) {
          label
          icon
          routerLink
        }
      }
    `;

    this.apollo
      .query<menu>({
        query: GET_MENU,
        variables: {
          role,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe()
      .subscribe(({ data }) => {
        ////console.log(data.items);
        if (this.items.length === 0) {
          data.items.forEach((element) => {
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

  save_Colaborador(
    colaborador: Colaborador
  ): Observable<MutationResult<RegisterColaborador>> {
    colaborador.name = colaborador.name.toUpperCase();
    colaborador.charge = colaborador.charge.toUpperCase();
    colaborador.phone = colaborador.phone.toString();
    const SAVE_COLABORADOR = gql`
      mutation registerColaborador(
        $colaborador: UserColaboradorRegisterInput!
      ) {
        registerColaborador(input: $colaborador) {
          haveError
          Err
        }
      }
    `;

    return this.apollo.mutate<RegisterColaborador>({
      mutation: SAVE_COLABORADOR,
      variables: {
        colaborador,
      },
      fetchPolicy: 'no-cache',
    });
  }

  save_Member(
    colaborador: Colaborador
  ): Observable<MutationResult<registerMember>> {
    colaborador.phone = colaborador.phone.toString();
    const SAVE_COLABORADOR = gql`
      mutation addMember($colaborador: EthicsCommitteMemberRegisterInput!) {
        registerMember(input: $colaborador) {
          id
          email
        }
      }
    `;

    return this.apollo.mutate<registerMember>({
      mutation: SAVE_COLABORADOR,
      variables: {
        colaborador,
      },
      fetchPolicy: 'no-cache',
    });
  }

  save_President(
    colaborador: Colaborador,
    ente_publico: string
  ): Observable<MutationResult<registerPresident>> {
    colaborador.phone = colaborador.phone.toString();
    const president: President = {
      email: colaborador.email,
      ente_publico,
      name: colaborador.name,
      phone: colaborador.phone,
    };
    //console.log(president);
    const SAVE_COLABORADOR = gql`
      mutation addPresident($president: EthicsCommitteRegisterInput!) {
        registerPresident(input: $president) {
          email
          id
        }
      }
    `;

    return this.apollo.mutate<registerPresident>({
      mutation: SAVE_COLABORADOR,
      variables: {
        president,
      },
      fetchPolicy: 'no-cache',
    });
  }
  update_Colaborador(
    colaborador: user_edit
  ): Observable<MutationResult<UpdateColaborador>> {
    colaborador.name = colaborador.name.toUpperCase();
    colaborador.charge = colaborador.charge.toUpperCase();
    colaborador.phone = colaborador.phone.toString();
    const UPDATE_COLABORADOR = gql`
      mutation updateColaborador($colaborador: UserUpdateColaboradorInput!) {
        updateColaborador(input: $colaborador) {
          haveError
          Err
        }
      }
    `;

    return this.apollo.mutate<UpdateColaborador>({
      mutation: UPDATE_COLABORADOR,
      variables: {
        colaborador,
      },
      fetchPolicy: 'no-cache',
    });
  }

  update_Member(
    colaborador: user_edit
  ): Observable<MutationResult<UpdateColaborador>> {
    colaborador.phone = colaborador.phone.toString();
    const UPDATE_COLABORADOR = gql`
      mutation updateColaborador($colaborador: UserUpdateColaboradorInput!) {
        updateColaborador: updateColaboradorCmm(input: $colaborador) {
          haveError
          Err
        }
      }
    `;

    return this.apollo.mutate<UpdateColaborador>({
      mutation: UPDATE_COLABORADOR,
      variables: {
        colaborador,
      },
      fetchPolicy: 'no-cache',
    });
  }

  delete_user(user: delete_user): Observable<MutationResult<delete_user>> {
    const DELETE_USER = gql`
      mutation deleteUser($user: UserDeleteInput!) {
        inactivateUser(input: $user) {
          id
        }
      }
    `;

    return this.apollo.mutate<delete_user>({
      mutation: DELETE_USER,
      variables: {
        user,
      },
      fetchPolicy: 'no-cache',
    });
  }

  delete_member(user: delete_user): Observable<MutationResult<delete_user>> {
    const DELETE_USER = gql`
      mutation inactivateUserCmm($user: UserDeleteInput!) {
        inactivateUserCmm(input: $user) {
          id
        }
      }
    `;

    return this.apollo.mutate<delete_user>({
      mutation: DELETE_USER,
      variables: {
        user,
      },
      fetchPolicy: 'no-cache',
    });
  }

  get_menu_portal(params: params_menu, queryParametes: object): items[] {
    this.clean_menu();
    //console.log("params", params,"queryParams",queryParametes);
    const GET_MENU_PORTAL = gql`
      query da_menu_portal($params: MenuQueryInput!) {
        items: getMenuByType(input: $params) {
          label
          icon
          routerLink
        }
      }
    `;
    this.apollo
      .query<menu>({
        query: GET_MENU_PORTAL,
        variables: {
          params,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe()
      .subscribe(({ data }) => {
        //console.log(data.items);
        if (this.items.length === 0) {
          data.items.forEach((element) => {
            if (element.label == 'Iniciar Sesión') {
              this.items.push({
                label: element.label,
                icon: element.icon,
                routerLink: element.routerLink,
                queryParams: queryParametes,
              });
            } else {
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

    //console.log("items DESPUES DE CONSULTAR", this.items);
    return this.items;
  }

  get_president(
    ente_publico: string
  ): Observable<MutationResult<findPresident>> {
    const GET_PRESIDENT = gql`{
      PresidetByEnte(input:"${ente_publico}"){
        id
      }
    }`;

    return this.apollo.query<findPresident>({
      query: GET_PRESIDENT,

      fetchPolicy: 'no-cache',
    });
  }

  //   getEntesList(): ente[] { 
  //   const array:[{}]= [{}];
  //   try {
  //     const GET_ENTES_PUBLICOS = gql`
  //       query RegresaEntes {
  //         entes: getEnte {
  //           id
  //           nombre_ente
  //         }
  //       }
  //     `;
  //   this.apollo
  //       .query<entesRequest>({
  //         query: GET_ENTES_PUBLICOS,
  //         fetchPolicy: 'no-cache',
  //       }).subscribe({
  //         next: ((dat) => {
  //           const { data } = dat;
  //           data.entes.forEach((ent) => {
  //              array.push({
  //               id:"naoeh",
  //               nombre_ente: "othuoaen"
  //             });
  //           })
  //          })
  //       });
              
  //     }catch (error) {
  //    console.log(error);
  //   }
  //   console.log(this.namesEntesList,"afuera",array[0]);
  //   return this.namesEntesList;
  // }

  // getListNamesEntes():string[]{
  //   const namesEntes: string[] = [];
  //   console.log(this.getEntesList()); 
  //   return namesEntes;
  // } 

  // getStadisticsByEnte(ente: history_init) {
   
  //   let count = 0;
  //   try {
  //     const GET_STADISTICS = gql`
  //       query getHistory($ente: HistoryRuleByEnteInput!) {
  //         staditics: getHistoryIntegrityRulesByEnte(input: $ente) {
  //           p1
  //           p2
  //           p3
  //           p4
  //           p5
  //           p6
  //           p7
  //           p8
  //           p9
  //           p10
  //           p11
  //           p12
  //           p13
  //           p14
  //           p15
  //           p16
  //         }
  //       }
  //     `;
  //      this.apollo
  //       .query<staditics_request>({
  //         query: GET_STADISTICS,
  //         variables: {
  //           ente,
  //         },
  //         fetchPolicy: 'no-cache',
  //       })
  //       .pipe(
  //         tap((dat) => {

  //          if(dat.data.staditics[0] !== undefined) {

  //           console.log(dat.data.staditics[0],ente,'<<<<<<<<<<<');

  //           dat.data.staditics[0].p1 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p2 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p3 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p4 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p5 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p6 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p7 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p8 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p9 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p10 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p11 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p12 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p13 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p14 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p15 ? (count = count + 1) : (count = count);
  //           dat.data.staditics[0].p16 ? (count = count + 1) : (count = count);
  //           return (count * 100) / 16;
  //          }
  //          return 0;     
  //         })
  //       )
  //       .subscribe(({ data }) => {
  //         console.log(data);
  //         return (count * 100) / 16;
  //       });
  //   } catch (error) {
  //     console.log("-----------------------------",error);
  //     return 0;
  //   }
  //   return 0;         
  // }


  getStadistics():Observable< MutationResult<Graficas> >{
    // console.log("----------from Service--------");    
    try {
      const GET_GRAFICO = gql`
      query getGrafico {
        Data:getGraficos{
          labels,
          datasets{
            label
            backgroundColor
            data
          }
        }
      }`;
        return this.apollo.query<Graficas>({
          query: GET_GRAFICO,
          fetchPolicy: 'no-cache'
        });     
    } catch (error) {     
      return of< MutationResult<Graficas>>( {} as MutationResult<Graficas>)
    }   
  }
}


 // const ds: dataset = {} as dataset; 
    // const listEntes: string[] = [];
    // const porcentages: number[] = [];
    // let ente: history_init = {} as history_init;
    // let result: staditics = {} as staditics;
    // let backgroundColor: Array<string> = [
    //   '#EC407A',
    //   '#AB47BC',
    //   '#42A5F5',
    //   '#7E57C2',
    //   '#66BB6A',
    //   '#FFCA28',
    //   '#26A69A',
    // ];
    // console.log('entre');
    // let n= 0;


// .pipe(
//   tap((d) => {
//     console.log(d);
//     d.data.entes.map((e) => {              // console.log(e);
      
//       console.log(">>>>>>>>>>>>>>",ente);
//       listEntes.push(e.nombre_ente);              
//       // console.log(listEntes);
     
//      this.getStadisticsByEnte({ ente_publico:e.id }).then(
//         (a) => {
//          n=a;
//         }
//       );
//       ds.label = 'Porcentaje de avance';
//       ds.backgroundColor = backgroundColor;
//       porcentages.push(n);
//       console.log(porcentages);
//       //result.datasets.data.push();
//     });
//   })
