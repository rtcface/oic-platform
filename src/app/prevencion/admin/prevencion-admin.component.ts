import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-prevencion-admin',
  templateUrl: './prevencion-admin.component.html',
  styleUrls: ['./prevencion-admin.component.scss'],
  providers: [MessageService]
})
export class PrevencionAdminComponent implements OnInit {
  activityForm!: FormGroup;
  complaintForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.activityForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      dependency: ['', Validators.required]
    });

    this.complaintForm = this.fb.group({
      municipality: ['', Validators.required],
      total: ['', [Validators.required, Validators.min(0)]]
    });
  }

  submitActivity(): void {
    if (this.activityForm.valid) {
      console.log('Activity submitted', this.activityForm.value);
      // Backend call goes here
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Actividad guardada correctamente'
      });
      this.activityForm.reset();
    }
  }

  submitComplaint(): void {
    if (this.complaintForm.valid) {
      console.log('Complaint submitted', this.complaintForm.value);
      // Backend call goes here
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Queja guardada correctamente'
      });
      this.complaintForm.reset();
    }
  }
}
