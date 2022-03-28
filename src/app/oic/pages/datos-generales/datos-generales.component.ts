import { Component, OnInit } from '@angular/core';
import { OicInterface, OicEnte } from '../../models/oic.interface';

import { filterEnte } from '../../models/tree.interface';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

  ente:string = '';

 
  constructor(
    ) { }
  

  ngOnInit(): void {
    
  }

  loadTreeForEnte():filterEnte{
   const filter:filterEnte = {
      boss: {
        ente: this.ente
      }
    }
    console.log("filter>>>>>>>>>>>>>>>>>>>>",filter);
    return filter;
  }

loadTreefromFinder( $event:OicEnte){
  this.ente = $event.ente.id;
  console.log("this.ente desde hijo",$event.ente.id);
  this.loadTreeForEnte();
}

    
   

}
