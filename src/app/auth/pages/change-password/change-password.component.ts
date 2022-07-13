import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [MessageService]
})
export class ChangePasswordComponent implements OnInit {

  myForm : FormGroup = this.fb.group({
    oldPassword     :     ['',[Validators.required]],
    newPassword     :     ['',[Validators.required]],
    confirmPassword :     ['',[Validators.required]],
    },{
      validators: this.matchPasswords('newPassword','confirmPassword')
    }

    
    );

  constructor(
    private fb : FormBuilder,
    private router:Router,
    private ar: ActivatedRoute,
    private authService:AuthService,
    private vs:ValidatorsService,   
    private readonly ms: MessageService
  ) { }

  ngOnInit(): void {
  }

 async changaPassword() {
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();      
      return;   
    }

    
   
    const {newPassword} = this.myForm.value;

    const request = await this.authService.change_password(newPassword).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (err) => {
        this.showError();
      },

    }
    );



  }


  validateField(field: string) {
    return this.myForm.get(field)?.invalid && this.myForm.get(field)?.touched;
  }

  getErrorMessage(field: string) {
    return this.myForm.get(field)?.hasError('required') ? 'campo requerido' :
      this.myForm.get(field)?.hasError('noMatch') ? 'Contraseñas no coinciden' :
        this.myForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
          '';
  }


  showError() {
    this.ms.add({ severity: 'error', summary: 'Error', detail: 'Usuario y/o Contraña incorrectos'});   //<-- Mensaje de error
  }

  matchPasswords(passNew: string, passConfirm: string){

    return ( formGroup:FormGroup ) => {

      const passNewControl = formGroup.get(passNew);
      const passConfControl = formGroup.get(passConfirm);

      if( passNewControl!.value === passConfControl!.value){
        passConfControl!.setErrors(null);
      }else{
        passConfControl!.setErrors({noMatch:true});
      }

    }

  }  

}
