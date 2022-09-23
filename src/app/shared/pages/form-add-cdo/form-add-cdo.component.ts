import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { cdoSaveEthic, delete_cdo, updateCdoEthic } from 'src/app/protected/models/kpis.interface';
import {  Colaborador, delete_user,  } from '../../models/colaborador.interface';
import { ValidatorsService } from '../../services/validators.service';

@Component({
  selector: 'app-form-add-cdo',
  templateUrl: './form-add-cdo.component.html',
  styleUrls: ['./form-add-cdo.component.scss'],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormAddCdoComponent implements OnChanges{

  @Input() isSave:boolean = true;
 
 @Input() cdoEdit:updateCdoEthic = {} as updateCdoEthic;
 
 @Input() isSaved:boolean = false;
 
 @Output() onDelete:EventEmitter<delete_cdo> = new EventEmitter();
 
 @Output() onSave:EventEmitter<cdoSaveEthic> = new EventEmitter();
 
 @Output() onUpdate:EventEmitter<updateCdoEthic> = new EventEmitter();

 @Output() onLoadDataUpdate:EventEmitter<updateCdoEthic> = new EventEmitter();

  cdoEthicForm = this.fb.group({
    description: ['',[Validators.required ]],
    url: ['',[Validators.required]],
    ente_publico: ['',[Validators.required]],       
  });
 

  constructor(
    private readonly fb : FormBuilder,
    private readonly vs : ValidatorsService,
    private readonly confirmationService: ConfirmationService,
    private readonly ms: MessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
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


  



 


 

}
