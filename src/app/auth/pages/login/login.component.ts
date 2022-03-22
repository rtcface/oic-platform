import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { data } from '../../interfaces/user_token.interface';

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
  loginValue: ['',[Validators.required, Validators.email, Validators.minLength(3)]],
  passwordValue:  ['',[Validators.required, Validators.minLength(3)]]
  });


  haveError : boolean = false;
   
 
  constructor( 
    private fb : FormBuilder,
    private router:Router,
    private authService:AuthService
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
    const res = await this.authService.login(loginValue,passwordValue).subscribe(
      data => {
        // console.log('login',data);   
        data.errors?.length === 0 ? this.haveError = false : this.haveError = true;     
        this.router.navigate(['/protected']);
      }
    ); 

    this.haveError = true;
   } catch (error) {
     console.log('error',error);
   }
    
    
  }

  validateField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  getErrorMessage(field: string) {
    return this.myForm.get(field)?.hasError('required') ? 'You must enter a value' :
      this.myForm.get(field)?.hasError('email') ? 'Not a valid email' :
        this.myForm.get(field)?.hasError('minlength') ? 'Min length 3' :
          '';
  }






}
