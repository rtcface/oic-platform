import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GraphQLResult } from 'src/app/graphql/interfaces/GraphQLResul.interface';
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

   
  const res = await this.authService.login(loginValue,passwordValue).subscribe(    
      data => {
         //data.errors ? console.log('Esto es el error en el login',data.errors) : this.router.navigate(['/protected']);
      }
    );

    console.log('Valor de res',res);
    
    
  }

  validateField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }




}
