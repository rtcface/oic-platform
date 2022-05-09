import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constantes } from '../../../../assets/constantes/constantes';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { params_menu } from '../../../shared/models/menu_interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {  
  items: MenuItem[] = []
  header_title = '' ;
  footer_title = '';
  route!: Subscription;
  params: params_menu = {
    portal: 'oic',
    role: 'user'
  }
  


  constructor(
    private readonly ar:ActivatedRoute,
    private authService: AuthService,
    private ss: SharedService
    ) {
     
     }

  ngOnInit(): void {
    this.route=this.ar.params.subscribe(     
      ( { type } ) => {       
        
        this.params.portal = type;
        this.params.role = this.authService.da_role;
        
        // console.log("log>>>>>>>>>>>>>",type, this.authService.da_role); 
        // console.log("log>>>>>>>>>>>>>",this.params);
        this.items=[];
        this.items = this.ss.get_menu_portal(this.params);
        

        console.log("log-home>>>>>>>>>>>>>",this.items);
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
