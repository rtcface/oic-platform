import { Component, OnInit } from '@angular/core';
import { finalize, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrevencionService } from '../services/prevencion.service';
import { Activity, Complaint } from '../models/prevencion.interface';

import { MenuItem } from 'primeng/api';
import { user_card } from 'src/app/shared/models/colaborador.interface';
import { Constantes } from 'src/assets/constantes/constantes';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { data } from 'src/app/auth/interfaces/user_token.interface';

@Component({
  selector: 'app-prevencion-admin',
  templateUrl: './prevencion-admin.component.html',
  styleUrls: ['./prevencion-admin.component.scss'],
  providers: [MessageService]
})
export class PrevencionAdminComponent implements OnInit {
  activityForm!: FormGroup;
  complaintForm!: FormGroup;

  isActivityLoading = false;
  isComplaintLoading = false;

  items: MenuItem[] = [];
  header_title = Constantes.header_oic;
  footer_title = Constantes.footer_oic;
  user: user_card = {
    name: 'User',
    email: 'sn@sn.sn',
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    isLogin: false
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private prevencionService: PrevencionService,
    private authService: AuthService,
    private ss: SharedService
  ) { }

  ngOnInit(): void {
    const datUser: data | undefined = this.authService.isLoggedIn;
    if (datUser && datUser.verify_authentication?.user) {
      this.user.name = datUser.verify_authentication.user.name;
      this.user.email = datUser.verify_authentication.user.email;
      this.user.avatar = datUser.verify_authentication.user.avatar;
      this.user.isLogin = true;
    } else if (datUser && datUser.login?.user) {
      this.user.name = datUser.login.user.name;
      this.user.email = datUser.login.user.email;
      this.user.avatar = datUser.login.user.avatar;
      this.user.isLogin = true;
    }
    
    // We pass role and portal 'oic' to simulate the admin portal menu locally
    this.items = this.ss.get_menu_portal({ portal: 'oic', role: this.authService.da_role || 'admin' }, { page: 'oic' });

    this.activityForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      evidence: this.fb.array([])
    });

    this.complaintForm = this.fb.group({
      procedentes: [null, [Validators.required, Validators.min(0)]],
      improcedentes: [null, [Validators.required, Validators.min(0)]]
    });
  }

  get evidence(): FormArray {
    return this.activityForm.get('evidence') as FormArray;
  }

  addEvidence(): void {
    this.evidence.push(this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      type: ['document']
    }));
  }

  removeEvidence(index: number): void {
    this.evidence.removeAt(index);
  }

  validateField(formName: 'activityForm' | 'complaintForm', field: string): boolean {
    const form = this[formName];
    return !!(form.get(field)?.invalid && form.get(field)?.touched);
  }

  submitActivity(): void {
    if (this.activityForm.valid && !this.isActivityLoading) {
      this.isActivityLoading = true;
      const activity: Activity = {
        name: this.activityForm.value.name,
        description: this.activityForm.value.description,
        evidence: this.activityForm.value.evidence,
        date: '',
        dependency: ''
      };
      this.prevencionService.saveActivity(activity).pipe(
        take(1),
        finalize(() => this.isActivityLoading = false)
      ).subscribe({
        next: (success) => {
          if (success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Actividad guardada correctamente'
            });
            this.activityForm.reset();
            this.evidence.clear();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo guardar la actividad'
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al guardar la actividad'
          });
        }
      });
    }
  }

  submitComplaint(): void {
    if (this.complaintForm.valid && !this.isComplaintLoading) {
      this.isComplaintLoading = true;
      const complaint: Complaint = {
        municipality: '',
        total: 0,
        procedentes: this.complaintForm.value.procedentes,
        improcedentes: this.complaintForm.value.improcedentes
      };
      this.prevencionService.saveComplaint(complaint).pipe(
        take(1),
        finalize(() => this.isComplaintLoading = false)
      ).subscribe({
        next: (success) => {
          if (success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Queja guardada correctamente'
            });
            this.complaintForm.reset();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo guardar la queja'
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al guardar la queja'
          });
        }
      });
    }
  }
}
