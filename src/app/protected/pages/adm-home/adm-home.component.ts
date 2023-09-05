import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { data } from 'src/app/auth/interfaces/user_token.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { user_card } from 'src/app/shared/models/colaborador.interface';
import { params_menu } from 'src/app/shared/models/menu_interface';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Constantes } from 'src/assets/constantes/constantes';

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.component.html',
  styleUrls: ['./adm-home.component.scss']
})
export class AdmHomeComponent implements OnInit, OnDestroy {
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
  ) { }

  ngOnInit(): void {
    this.route=this.ar.queryParams.subscribe( 

      ( { type } ) => {       
        //console.log("------------*"+type+"*---------------",type);
        this.params.portal = type;
        this.params.role = this.authService.da_role;

        const datUser:data | undefined = this.authService.isLoggedIn;

        if(datUser!=undefined){
          this.user.name = datUser.verify_authentication.user.name;
          this.user.email = datUser.verify_authentication.user.email;
          this.user.avatar = datUser.verify_authentication.user.avatar;
          this.user.isLogin = true;
        }
       
        
       
        //console.log("log=====UserData",datUser);
        
         //console.log("log>>>>>>>>>>>>>Conut--+++",type, this.authService.da_role); 
         //console.log("log>>>>>>>>>>>>>",this.params);
        
        
        //console.log("log-home>>>>>>>>>>>>>",this.items);
        if(type=='oic'){    
          //console.log("In OIC --==-0-Params",this.params);      
          this.header_title = Constantes.header_oic;
          this.footer_title = Constantes.footer_oic;
          //this.items=[];
          this.items = this.ss.get_menu_portal(this.params,this.queryParams);
          //console.log("In OIC --==-0-Items",this.items);
        }
        if(type=='plt'){
          //console.log("In PLT=====-Params",this.params);
          this.header_title = Constantes.header_plt;
          this.footer_title = Constantes.footer_plt;
          this.queryParams= {
                              ['page']: 'plt'
                            };
          //this.items=[];
          this.items = this.ss.get_menu_portal(this.params,this.queryParams);
          //console.log("In PLT=====-Items",this.items);
          //console.log("log-home-count>>>>>>>>>>>>>",this.items.length);
        }

      


      }
    )




  }

  ngOnDestroy(): void {   
    this.items=[];
    //console.log("log-home>>>>>>>>>>>>>=========================",this.items);
    this.route.unsubscribe();
  }

}
