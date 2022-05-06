import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constantes } from '../../../../assets/constantes/constantes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  header_title = '' ;
  footer_title = '';
  route!: Subscription;


  constructor(private readonly ar:ActivatedRoute) { }

  ngOnInit(): void {

    this.route=this.ar.params.subscribe(      
     
      ( { type } ) => {
        
        console.log(type)    
      
        if(type=='oic'){
          
          this.header_title = Constantes.header_oic;
          this.footer_title = Constantes.footer_oic;
        }
        if(type=='plt'){
          this.header_title = Constantes.header_plt;
          this.footer_title = Constantes.footer_plt;
        }

      }
      
    );
  }

  ngOnDestroy(): void {
    this.route.unsubscribe();
  }

}
