import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorsService } from '../../services/validators.service';
import { Colaborador } from '../../models/colaborador.interface';
import { MessageService } from 'primeng/api';
import { SharedService } from '../../services/shared.service';
import { DatosGeneralesComponent } from '../../../oic/pages/datos-generales/datos-generales.component';

@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.scss'],
  
})
export class FormUsersComponent implements OnInit {

  
 @Input() isSave: boolean = true;

 @Output() onDelete:EventEmitter<any> = new EventEmitter();
 @Output() onSave:EventEmitter<Colaborador> = new EventEmitter();
 @Output() onUpdate:EventEmitter<any> = new EventEmitter();
 
 

  userForm = this.fb.group({
    name: ['',[Validators.required, Validators.pattern(this.vs.nameAndLastNamePattern)]],
    email: ['',[Validators.required, Validators.pattern(this.vs.emailPattern)]],
    charge: ['',[Validators.required, Validators.minLength(3)]],
    phone: ['',[Validators.required, Validators.pattern(this.vs.phonePattern)]],   
  });

  constructor(
    private readonly fb : FormBuilder,
    private readonly vs : ValidatorsService
    ) { }
    
   

  ngOnInit(): void {
    
  }


  validateSubmit() {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();     
    } else {
      console.log("en el submi>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.userForm.value);
      this.onSave.emit(this.userForm.value);
      this.userForm.reset();
    }
    
  }

  // save() {
  //   console.log("desde el hijo");
  //   this.onSaveUser.emit("hola desde el hijo");
  // }

  updateUser() {
    console.log("desde el hijo");
    this.onUpdate.emit("hola desde el hijo update");
  }
  
  delete(){
    console.log("desde el hijo");
    this.onDelete.emit("hola desde el hijo delete");
  }
   // console.log("en el submit", this.idParent);

      // if(this.isSave){

      //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",this.userForm.value);
      //   const {name, email, charge, phone,parentId } = this.userForm.value;
      //   const colaborador: Colaborador = {
      //     name,
      //     email,
      //     charge,
      //     phone,
      //     parentId
      //   };

      // this.saveColaborador(colaborador);

      // this.userForm.reset();
      // this.ms.add({severity:'success', summary:'Guardado', detail:'Guardado con exito'});
      //}
      //return true;




  // saveColaborador(colaborador: Colaborador) {
  //   console.log(colaborador);
  //   this.ss.save_Colaborador(colaborador);
  // }

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
