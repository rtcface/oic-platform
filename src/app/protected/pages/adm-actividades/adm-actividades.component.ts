import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-actividades',
  templateUrl: './adm-actividades.component.html',
  styleUrls: ['./adm-actividades.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AdmActividadesComponent implements OnInit {
  form!: FormGroup;
  evidenceForm!: FormGroup;
  editForm!: FormGroup;

  actividades: any[] = [];
  isLoading = false;
  isSavingEvidence = false;
  isSavingActivity = false;
  isSavingEdit = false;

  showEvidenceDialog = false;
  showEditDialog = false;
  selectedActividadId = '';
  selectedFileName = '';
  selectedFileBase64 = '';

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });

    this.evidenceForm = this.fb.group({
      titulo_evidencia: ['', [Validators.required]]
    });

    this.editForm = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });

    this.loadActividades();
  }

  loadActividades(): void {
    this.isLoading = true;
    this.sharedService.get_Actividades().subscribe({
      next: (res) => {
        this.isLoading = false;
        const list = res.data?.getActividades || [];
        const idEnte = this.authService.idEnteAuth;
        this.actividades = list.filter((act: any) => act.ente_publico?.id === idEnte);
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las actividades' });
      }
    });
  }

  openEvidenceDialog(actividadId: string): void {
    this.selectedActividadId = actividadId;
    this.selectedFileName = '';
    this.selectedFileBase64 = '';
    this.evidenceForm.reset();
    this.showEvidenceDialog = true;
  }

  openEditDialog(act: any): void {
    this.selectedActividadId = act.id;
    this.editForm.patchValue({
      titulo: act.titulo,
      descripcion: act.descripcion
    });
    this.showEditDialog = true;
  }

  confirmDelete(act: any): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que querés eliminar la actividad "<strong>${act.titulo}</strong>"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteActividad(act.id)
    });
  }

  deleteActividad(id: string): void {
    this.sharedService.delete_Actividad(id).subscribe({
      next: (res) => {
        if (res.data?.deleteActividad?.id || res.data?.deleteActividad?.success) {
          this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Actividad eliminada correctamente' });
          this.loadActividades();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la actividad' });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la actividad' });
      }
    });
  }

  submitEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSavingEdit = true;
    this.sharedService.update_Actividad(this.selectedActividadId, {
      titulo: this.editForm.value.titulo,
      descripcion: this.editForm.value.descripcion
    }).subscribe({
      next: (res) => {
        this.isSavingEdit = false;
        if (res.data?.updateActividad?.id || res.data?.updateActividad?.success) {
          this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Actividad actualizada correctamente' });
          this.showEditDialog = false;
          this.loadActividades();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la actividad' });
        }
      },
      error: () => {
        this.isSavingEdit = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la actividad' });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.selectedFileBase64 = result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSavingActivity = true;
    this.sharedService.save_Actividad({
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion
    }).subscribe({
      next: (res) => {
        this.isSavingActivity = false;
        if (res.data?.saveActividad?.success || res.data?.saveActividad?.id) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Actividad guardada correctamente' });
          this.form.reset();
          this.loadActividades();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la actividad' });
        }
      },
      error: () => {
        this.isSavingActivity = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en la petición' });
      }
    });
  }

  submitEvidence(): void {
    if (this.evidenceForm.invalid || !this.selectedFileBase64) {
      this.evidenceForm.markAllAsTouched();
      if (!this.selectedFileBase64) {
        this.messageService.add({ severity: 'warn', summary: 'Archivo requerido', detail: 'Debe seleccionar una imagen o archivo' });
      }
      return;
    }

    this.isSavingEvidence = true;
    const inputEv = {
      titulo: this.evidenceForm.value.titulo_evidencia,
      archivo: this.selectedFileBase64
    };

    this.sharedService.add_Evidencia(this.selectedActividadId, inputEv).subscribe({
      next: (res) => {
        this.isSavingEvidence = false;
        if (res.data?.addEvidencia?.success || res.data?.addEvidencia?.id) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evidencia adjuntada correctamente' });
          this.showEvidenceDialog = false;
          this.loadActividades();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la evidencia' });
        }
      },
      error: () => {
        this.isSavingEvidence = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en la petición' });
      }
    });
  }
}
