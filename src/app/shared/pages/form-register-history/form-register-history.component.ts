import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { history_save } from '../../models/history.interface';
import { ValidatorsService } from '../../services/validators.service';

@Component({
  selector: 'app-form-register-history',
  templateUrl: './form-register-history.component.html',
  styleUrls: ['./form-register-history.component.scss']
})
export class FormRegisterHistoryComponent implements OnInit {

  @Input() historyEdit:history_save = {} as history_save;
  
  @Output() onSave:EventEmitter<history_save> = new EventEmitter();

  historyForm = this.fb.group({
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

  ngOnInit(): void {
  }

  saveSubmit(){    
    console.log(this.historyForm);
  }

}
