import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { cdoSaveEthic, delete_cdo, updateCdoEthic } from 'src/app/protected/models/kpis.interface';
import { ValidatorsService } from '../../services/validators.service';

@Component({
  selector: 'app-form-add-cdo',
  templateUrl: './form-add-cdo.component.html',
  styleUrls: ['./form-add-cdo.component.scss'],
  providers: [ConfirmationService, MessageService],
  
})
export class FormAddCdoComponent implements OnChanges{

 @Input() existeCode:boolean = false;

 @Input() isSave:boolean = true;
 
 @Input() cdoEdit:updateCdoEthic = {} as updateCdoEthic;
 
 @Input() isSaved:boolean = false;
 
 @Output() onDelete:EventEmitter<delete_cdo> = new EventEmitter();
 
 @Output() onSave:EventEmitter<cdoSaveEthic> = new EventEmitter();
 
 @Output() onUpdate:EventEmitter<updateCdoEthic> = new EventEmitter();

 @Output() onLoadDataUpdate:EventEmitter<updateCdoEthic> = new EventEmitter();

  cdoEthicForm = this.fb.group({
    description: ['',[Validators.required]],
    url: ['',[Validators.required]],
    ente_publico: [''],       
  });
 

  constructor(
    private readonly fb : FormBuilder,
    private readonly vs : ValidatorsService,
    private readonly confirmationService: ConfirmationService,
    private readonly ms: MessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void { 
    this.counterRender();
    this.changeStatusForm();
    this.loadCdoEdit(this.cdoEdit);
    if(this.isSaved){
      console.log("entre en is saved")
      this.cdoEthicForm.reset();
    }


  }

  loadCdoEdit(cdo:updateCdoEthic){
    console.log("from form update");
    this.cdoEthicForm.reset(
      {
       description: cdo.description,
       url: cdo.url
      }
    );
  }

  changeStatusForm(){
    this.existeCode ? this.cdoEthicForm.disable() : this.cdoEthicForm.enable();
  }

  confirm(event: Event){
    this.confirmationService.confirm({
      target: event.target!,
      message: `Esta seguro de eliminar el ${this.cdoEdit.description} ?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const del_cdo:delete_cdo={
          id: this.cdoEdit.id
        }
        this.onDelete.emit(del_cdo);        
      },
      
    });
  }

  validateField(field: string) {
    return this.cdoEthicForm.get(field)?.invalid && this.cdoEthicForm.get(field)?.touched;
  }

  getErrorMessage(field: string) {      
    
    const message:string = "Debe ingresar un valor válido";
    return this.cdoEthicForm.get(field)?.hasError('required') ? message :'';
          
  }

  validateSubmit() {
    
    if (this.cdoEthicForm.invalid) {
      this.cdoEthicForm.markAllAsTouched();     
    } else {
      console.log(this.cdoEthicForm.value);
      this.onSave.emit(this.cdoEthicForm.value);
      if(this.isSaved){
      this.cdoEthicForm.reset();
      }
    }
  }
    
  updateCdo() {    
    if(this.cdoEthicForm.invalid){     
      this.cdoEthicForm.markAllAsTouched();     
    } else {
      const cdo:updateCdoEthic = this.cdoEthicForm.value;
      cdo.id = this.cdoEdit.id;
      this.onUpdate.emit(cdo);
    }     
  }

  counterRender(): boolean{

    console.log("Render de FormUsersComponent");
    return true;
  }

}
