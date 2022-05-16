import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constantes } from 'src/assets/constantes/constantes';



@Component({
  selector: 'app-main-cards',
  templateUrl: './main-cards.component.html',
  styleUrls: ['./main-cards.component.scss']
})
export class MainCardsComponent implements OnInit {

  uri_icon_oic= Constantes.uri_icon_oic;
  uri_icon_plt= Constantes.uri_icon_plt;
  title_card_oic: string = Constantes.title_card_oic;
  title_card_plt: string = Constantes.title_card_plt;
  constructor( private readonly router:Router) { }

  ngOnInit(): void {
  }

  onClickOic() {
    this.router.navigate(['/oic', 'oic' ]);
    console.log('Click en el Órgano Interno de Control');
  }

  onClickPlt() {
    this.router.navigate(['/oic/plt', 'plt'] );
    console.log('Click en la Ética Pública');
  }

}
