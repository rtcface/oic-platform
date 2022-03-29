import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorsService } from '../../services/validators.service';
import { Colaborador } from '../../models/colaborador.interface';
import { MessageService } from 'primeng/api';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.scss'],
  providers: [MessageService]
})
export class FormUsersComponent implements OnInit {

  
 @Input() isSave: boolean = true;
 @Input() idParent: string = "";
  
 

  userForm = this.fb.group({
    name: ['',[Validators.required, Validators.pattern(this.vs.nameAndLastNamePattern)]],
    email: ['',[Validators.required, Validators.pattern(this.vs.emailPattern)]],
    charge: ['',[Validators.required, Validators.minLength(3)]],
    phone: ['',[Validators.required, Validators.pattern(this.vs.phonePattern)]],   
    
  });

  constructor(
    private readonly fb : FormBuilder,
    private readonly vs : ValidatorsService,
    private readonly ms : MessageService,
    private readonly ss : SharedService
  ) { }
    
   

  ngOnInit(): void {
  }


  validateSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return false;
    } else {

      if(this.isSave){

        console.log(this.userForm.value);
        const {name, email, charge, phone} = this.userForm.value;
        const colaborador: Colaborador = {
          name,
          email,
          charge,
          phone,
          parentId: this.idParent,
        };

        this.saveColaborador(colaborador);

        this.userForm.reset();
        this.ms.add({severity:'success', summary:'Guardado', detail:'Guardado con exito'});
      }


      return true;
    }
    
  }

  saveColaborador(colaborador: Colaborador) {
    this.ss.save_Colaborador(colaborador);
  }

  validateField(field: string) {
    return this.userForm.get(field)?.invalid && this.userForm.get(field)?.touched;
  }

  getErrorMessage(field: string) {
      
    const message:string = "Debe ingresar un valor válido";
    const messageEmail:string = "Debe ingresar un email valido";
    const messageName:string = "Debe ingresar un nombre y apellido valido";

    
    if(field == "email"){
      return this.userForm.get(field)?.hasError('required') ? message :
      this.userForm.get(field)?.hasError('pattern') ? messageEmail :
        this.userForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
          '';
        }else if(field == "name"){
          return this.userForm.get(field)?.hasError('required') ? message :
          this.userForm.get(field)?.hasError('pattern') ? messageName :
            this.userForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
              '';
        }else if(field == "phone")
        {        
            return this.userForm.get(field)?.hasError('required') ? message :
            this.userForm.get(field)?.hasError('pattern') ? 'Debe ingresar un numero de telefono valido a 10 digitos':            
            '';     
        }

      return this.userForm.get(field)?.hasError('required') ? message :
      this.userForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
      '';    
  }



}
