import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { ValidatorsService } from '../../services/validators.service';
import { Colaborador, delete_user, user_edit } from '../../models/colaborador.interface';


@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.scss'],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class FormUsersComponent implements OnChanges {

 
 @Input() isSave:boolean = true;
 
 @Input() userEdit:user_edit = {} as user_edit;
 
 @Input() isSaved:boolean = false;
 
 @Output() onDelete:EventEmitter<any> = new EventEmitter();
 
 @Output() onSave:EventEmitter<Colaborador> = new EventEmitter();
 
 @Output() onUpdate:EventEmitter<user_edit> = new EventEmitter();

 @Output() onLoadDataUpdate:EventEmitter<user_edit> = new EventEmitter();

  userForm = this.fb.group({
    name: ['',[Validators.required ]],
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

      // console.log("desde el hijo", this.userEdit);
      
    }
  ngOnChanges(changes: SimpleChanges): void {    
    //console.log("en el ngOnChanges", this.userEdit);
    this.loaduserEdit(this.userEdit);
    if(this.isSaved){
      this.userForm.reset();
    }
        
  }


  validateSubmit() {

    //console.log(">>>>>>>>>>>>>>>> validateSubmit:>> isSaved:"+this.isSaved, "value form", this.userForm.value);

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();     
    } else {
      // console.log("en el submi>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.userForm.value);
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

  loaduserEdit(user:user_edit){
    this.userForm.reset(
      {
        name: this.userEdit.name,
        email: this.userEdit.email,
        charge: this.userEdit.charge,
        phone: this.userEdit.phone

      }
    );
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

  counterRender(): boolean{

    console.log("Render de FormUsersComponent");
    return true;
  }
  

}
