import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { timer } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
  :host ::ng-deep .p-password input {
    width: 15rem;
  }
`],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myForm : FormGroup = this.fb.group({
  loginValue: ['',[Validators.required, Validators.pattern(this.vs.emailPattern), Validators.minLength(3)]],
  passwordValue:  ['',[Validators.required]]
  });


  haveError : boolean = false;
 
 
  constructor( 
    private fb : FormBuilder,
    private router:Router,
    private authService:AuthService,
    private vs:ValidatorsService,
    private sharedService:SharedService
    ) { }

  ngOnInit(): void {
  }

  async login(){

    if(this.myForm.invalid){

      this.myForm.markAllAsTouched();      
      return;

   
    }

   const {loginValue,passwordValue} = this.myForm.value;

   try {
    const res = await this.authService.login(loginValue,passwordValue).subscribe({
      next: (data) => {       
       
      },
      error: (err) => {
        this.haveError = true;
      },
      complete: () => {       
        this.router.navigate(['/protected']);
      }

    });

    timer(5000).subscribe(() => {
      this.haveError = false;
    }
    );
    
   } catch (error) {
     console.log("Este es el error:===>",error);
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






}




