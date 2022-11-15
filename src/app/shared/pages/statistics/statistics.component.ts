import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { OicGraphqlServiceService } from 'src/app/graphql/services/oic-graphql-service.service';
import { ente, entesRequest } from '../../models/history.interface';
import { SharedService } from '../../services/shared.service';



@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  loading!: boolean;
  private namesEntesList: ente[] = [];
  basicData: any;
  horizontalOptions: any;
  stackedOptions: any;
  listNamesPublicBody: string[] = [];
  porcentageByente: number[] = [];
  private getEntesSubscription: Subscription = new Subscription();
  private getNamesListSubscription: Subscription = new Subscription();
  //Data
  // {
  //     labels: [
  //       'Amaxac de Guerrero',
  //       'Apetatitlán de Antonio Carvajal',
  //       'Atlangatepec',
  //       'Altzayanca',
  //       'Apizaco',
  //       'Calpulalpan',
  //       'El Carmen Tequexquitla',
  //       'Cuapiaxtla',
  //       'Coaxomulco',
  //       'Chiahutempan',
  //       'Muñoz de Domingo Arenas',
  //       'Españita',
  //       'Huamantla',
  //       'Hueyotlipan',
  //       'Ixtacuixtla de Mariano Matamoros',
  //       'Ixtenco',
  //       'Mazatechoco de José Maria Morelos',
  //       'Contla de Juan Cuamatzi',
  //       'Tepetitla de Lardizábal',
  //       'Sanctórum de Lazaro Cardenas',
  //       'Nanacampila de Mariano Arista',
  //       'Acuamanala de Miguel Hidalgo',
  //       'Natívitas',
  //       'Panotla',
  //       'San Pablo del Monte',
  //       'Santa Cruz Tlaxcala',
  //       'Tenancingo',
  //       'Teolocholco',
  //       'Tepeyanco',
  //       'Terrenate',
  //       'Tetla de la Solidaridad',
  //       'Tetlatlahuca',
  //       'Tlaxcala',
  //       'Tlaxco',
  //       'Tocatlan',
  //       'Totolac',
  //       'Zitlaltepec de Trinidad Sánchez Santos',
  //       'Tzompantepec',
  //       'Xalostoc',
  //       'Xaltocan',
  //       'Papalotla de Xicohtencatl',
  //       'Xicohtzinco',
  //       'Yahuquemecan',
  //       'Zacatelco',
  //       'Benito Juárez',
  //       'Emiliano Zapata',
  //       'Lázaro Cárdenas',
  //       'La Magdalena Tlaltelulco',
  //       'San Damián Techoloc',
  //       'San Francisco Tetlanohcan',
  //       'San Jeronimo Zacualpan',
  //       'San Jóse Teacalco}o',
  //       'San Lorenzo Axocomoanitla',
  //       'San Lucas Tecopilco',
  //       'Santa Ana Nopalulcan',
  //       'Santa Apolonia Teacalco',
  //       'Santa Catarina Ayometla',
  //       'Santa Cruz Quiletla',
  //       'Santa Isabel Xiloxoxtla'
  //     ],
  //     datasets: [
  //         {
  //             label: 'Porcentaje de avance',
  //             backgroundColor: [
  //               '#EC407A',
  //               '#AB47BC',
  //               '#42A5F5',
  //               '#7E57C2',
  //               '#66BB6A',
  //               '#FFCA28',
  //               '#26A69A'
  //           ],
  //             data: [
  //               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  //             ],
  //         }
  //     ]
  // };

  constructor(private ss: SharedService, private readonly gp:OicGraphqlServiceService) {}

  ngOnDestroy(): void {
    this.getEntesSubscription.unsubscribe();
    this.getNamesListSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getEntesList();
    this.getNamesList();
    this.basicData = this.ss.getStadistics(this.namesEntesList);
    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }

  getEntesList() {
    this.getEntesSubscription = this.gp.getEntes().subscribe((ente) => {      
        this.namesEntesList=ente;
        //console.log(this.namesEntesList);
      });
  }

  getNamesList() {
    this.getNamesListSubscription = this.gp.getNamesEntes().subscribe(
      (listName) => {
        console.log("other")
        console.log(listName,"--------")
      });
  }
}
