import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
  :host ::ng-deep .p-password input {
    width: 15rem;
  }
`],
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
  //TODO: Remove USER DATA 
  myForm : FormGroup = this.fb.group({
  loginValue: ['crosalioev@gmail.com',[Validators.required, Validators.pattern(this.vs.emailPattern), Validators.minLength(3)]],
  passwordValue:  ['T3mp0r4l',[Validators.required]]
  });
    
  role = 'user';
  route!: Subscription;
  page = 'oic';
  firstSignIn = false;
 
  constructor( 
    private fb : FormBuilder,
    private router:Router,
    private ar: ActivatedRoute,
    private authService:AuthService,
    private vs:ValidatorsService,   
    private readonly ms: MessageService
    ) { }

  ngOnDestroy(): void {
    this.route.unsubscribe();
  }

  ngOnInit(): void {
    this.route = this.ar.queryParams.subscribe(params => {
      this.page = params['page'];
      console.log("page",this.page);
    });
  }

  async login(){

    this.authService.logout();

    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();      
      return;   
    }

   const {loginValue,passwordValue} = this.myForm.value;

   try {
    const res = await this.authService.login(loginValue,passwordValue,this.page).subscribe({
      next: (data) => {  
        this.role = data.data?.login?.user?.role!;
        this.firstSignIn = data.data?.login?.user?.firstSignIn!;
        console.log("role desde next",this.role);
       
      },
      error: (err) => {
        this.showError();
      },  
      complete: () => {  

        if(this.role=='user' && this.page=='oic' && this.firstSignIn){
          this.router.navigate(['/oic/oic']);
          return;
        }

        if(this.role=='user' && this.page=='plt'  && this.firstSignIn){
          this.router.navigate(['/oic/plt/plt']);
          return;
        }

        if(this.role=='admin' && this.page=='oic'  && this.firstSignIn){
          this.router.navigate(['/oic/oic/protected-admin']);
          return;
        }

        if(this.role=='admin' && this.page=='plt'  && this.firstSignIn){
          this.router.navigate(['/oic/plt/protected-admin']);
          return;
        }

        if(this.role=='contralor' && this.page=='oic'  && this.firstSignIn){
          console.log("contralor", this.router);
          this.router.navigate(['/protected/adm-users'],{queryParams: {type: 'oic'}});
          return;
        }
        
        if(this.role=='contralor' && this.page=='plt'  && this.firstSignIn){
          this.router.navigate(['/protected/plt'],{queryParams: {type: 'plt'}});
          return;
        }

        if(!this.firstSignIn){
         this.router.navigate(['/auth/change-password']);
        }
       }
    });    

   
    
   } catch (error) {
    //  console.log("Este es el error:===>",error);
   }
  
   
    
  }

  validateField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  getErrorMessage(field: string) {
    return this.myForm.get(field)?.hasError('required') ? 'Campo requerido' :
      this.myForm.get(field)?.hasError('pattern') ? 'correo no valido' :
        this.myForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
          '';
  }


  showError() {
    this.ms.add({ severity: 'error', summary: 'Error', detail: 'Usuario y/o Contraseña incorrectos'});   //<-- Mensaje de error
  }



}




