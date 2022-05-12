import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constantes } from '../../../../assets/constantes/constantes';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { params_menu } from '../../../shared/models/menu_interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MenuItem } from 'primeng/api';
import { user_card } from 'src/app/shared/models/colaborador.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {  
  items: MenuItem[] = []
  header_title = '' ;
  footer_title = '';
  queryParams:object={
    ['page']: 'oic'
  };
  route!: Subscription;
  params: params_menu = {
    portal: 'oic',
    role: 'user'
  }

  user: user_card = {
    name: 'User',
    email: 'sn@sn.sn',
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    isLogin: false
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
          this.queryParams= {
                              ['page']: 'plt'
                            };
        }

        this.items.forEach(element => {
          element.queryParams = this.queryParams;
        });

      }
      
    );    
  }

  ngOnDestroy(): void {
    this.route.unsubscribe();
  }

}
