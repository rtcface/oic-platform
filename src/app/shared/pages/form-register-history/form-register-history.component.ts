import { Component, EventEmitter, Input,  OnChanges,  Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { history_update } from '../../models/history.interface';
import { ValidatorsService } from '../../services/validators.service';

@Component({
  selector: 'app-form-register-history',
  templateUrl: './form-register-history.component.html',
  styleUrls: ['./form-register-history.component.scss']
})
export class FormRegisterHistoryComponent implements OnChanges {

  @Input() historyEdit:history_update = { } as history_update;
  
  @Output() onSave:EventEmitter<history_update> = new EventEmitter();

  historyForm = this.fb.group({
    id: [''],
    ente_publico: [''],
    p1: [false],
    p2: [false],
    p3: [false],
    p4: [false],
    p5: [false],
    p6: [false],
    p7: [false],
    p8: [false],
    p9: [false],
    p10: [false],
    p11: [false],
    p12: [false],
    p13: [false],
    p14: [false],
    p15: [false],
    p16: [false]
    });

  constructor(
    private readonly fb : FormBuilder,
    private readonly vs : ValidatorsService,
    // private readonly confirmationService: ConfirmationService,
    // private readonly ms: MessageService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.loadHistory(this.historyEdit);
  }

 

  saveSubmit(){
    console.log(this.historyForm.value);
    this.onSave.emit(this.historyForm.value);
  }


  loadHistory(item:history_update){
      if(item != undefined){
        console.log(">>>>>>loadHistory"+ JSON.stringify(item));
        this.historyForm.reset(
          {
          id: item.id,
          ente_publico: item.ente_publico,
          p1: item.p1,
          p2: item.p2,
          p3: item.p3,
          p4: item.p4,
          p5: item.p5,
          p6: item.p6,
          p7: item.p7,
          p8: item.p8,
          p9: item.p9,
          p10: item.p10,
          p11: item.p11,
          p12: item.p12,
          p13: item.p13,
          p14: item.p14,
          p15: item.p15,
          p16: item.p16,  
          }
        );
      }
  }

}
