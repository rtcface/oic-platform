import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { ValidatorsService } from '../../services/validators.service';
import { Colaborador, delete_user, user_edit } from '../../models/colaborador.interface';


@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.scss'],
  providers: [ConfirmationService, MessageService]
  
})
export class FormUsersComponent implements OnInit {

 @Input() isSaved:boolean = false;
 @Input() isSave:boolean = true;
 @Input() userEdit:user_edit = {} as user_edit;
 @Output() onDelete:EventEmitter<any> = new EventEmitter();
 @Output() onSave:EventEmitter<Colaborador> = new EventEmitter();
 @Output() onUpdate:EventEmitter<user_edit> = new EventEmitter();
 


  

  userForm = this.fb.group({
    name: ['',[Validators.required, Validators.pattern(this.vs.nameAndLastNamePattern)]],
    email: ['',[Validators.required, Validators.pattern(this.vs.emailPattern)]],
    charge: ['',[Validators.required, Validators.minLength(3)]],
    phone: [,[Validators.required, Validators.pattern(this.vs.phonePattern)]],    
  });

  constructor(
    private readonly fb : FormBuilder,
    private readonly vs : ValidatorsService,
    private readonly confirmationService: ConfirmationService,
    private readonly ms: MessageService
    ) { 

      console.log("desde el hijo", this.userEdit);
    }
    
   

  ngOnInit(): void {
    
  }


  validateSubmit() {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();     
    } else {
      console.log("en el submi>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.userForm.value);
      this.onSave.emit(this.userForm.value);
      if(this.isSaved){
      this.userForm.reset();
      }
    }
    
  }

  updateUser() {  
   
    if(this.userForm.invalid){
      
      this.userForm.markAllAsTouched();

     
    } else {
      const user:user_edit = this.userForm.value;
      user.id = this.userEdit.id;
      this.onUpdate.emit(user);
    }
     
  }
  
  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target!,
        message: `Esta seguro de eliminar a ${this.userEdit.name} ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {          
          const user:delete_user={
            id: this.userEdit.id
          };
            this.onDelete.emit(user);
        },
        reject: () => {
          this.noDelete();
          this.onDelete.emit(null);
        }
    });
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

  // create message for cancel button click
  noDelete() {
    this.ms.add({ severity: 'error', summary: 'Cancelo', detail: `Sera en otra ocasión ${this.userEdit.name}...`});   //<-- Mensaje de error
  }

  

}
