import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-adm-quejas',
  templateUrl: './adm-quejas.component.html',
  styleUrls: ['./adm-quejas.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AdmQuejasComponent implements OnInit {
  registerForm!: FormGroup;
  editForm!: FormGroup;

  quejas: any[] = [];
  isLoading = false;
  isSaving = false;
  isSavingEdit = false;

  showEditDialog = false;
  selectedQuejaId = '';

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      procedentes: [null, [Validators.required, Validators.min(0)]],
      improcedentes: [null, [Validators.required, Validators.min(0)]]
    });

    this.editForm = this.fb.group({
      procedentes: [null, [Validators.required, Validators.min(0)]],
      improcedentes: [null, [Validators.required, Validators.min(0)]]
    });

    this.loadQuejas();
  }

  loadQuejas(): void {
    this.isLoading = true;
    this.sharedService.get_Quejas().subscribe({
      next: (res) => {
        this.isLoading = false;
        const list = res.data?.getQuejas || [];
        const idEnte = this.authService.idEnteAuth;
        this.quejas = list.filter((q: any) => q.ente_publico?.id === idEnte);
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las quejas' });
      }
    });
  }

  get totalProcedentes(): number {
    return this.quejas.reduce((sum, q) => sum + (q.procedentes || 0), 0);
  }

  get totalImprocedentes(): number {
    return this.quejas.reduce((sum, q) => sum + (q.improcedentes || 0), 0);
  }

  openEditDialog(queja: any): void {
    this.selectedQuejaId = queja.id;
    this.editForm.patchValue({
      procedentes: queja.procedentes,
      improcedentes: queja.improcedentes
    });
    this.showEditDialog = true;
  }

  submitEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSavingEdit = true;
    this.sharedService.update_Queja(this.selectedQuejaId, {
      procedentes: this.editForm.value.procedentes,
      improcedentes: this.editForm.value.improcedentes
    }).subscribe({
      next: (res) => {
        this.isSavingEdit = false;
        if (res.data?.updateQueja?.id || res.data?.updateQueja?.success) {
          this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Queja actualizada correctamente' });
          this.showEditDialog = false;
          this.loadQuejas();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la queja' });
        }
      },
      error: () => {
        this.isSavingEdit = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la queja' });
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.sharedService.save_Queja(this.registerForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.data?.saveQueja?.success || res.data?.saveQueja?.id) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Queja registrada correctamente' });
          this.registerForm.reset();
          this.loadQuejas();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la queja' });
        }
      },
      error: () => {
        this.isSaving = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en la petición' });
      }
    });
  }

  confirmDelete(queja: any): void {
    const formattedDate = new Date(queja.createdAt).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    this.confirmationService.confirm({
      message: `¿Estás seguro de que querés eliminar el registro de quejas del <strong>${formattedDate}</strong> (Procedentes: ${queja.procedentes}, Improcedentes: ${queja.improcedentes})?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteQueja(queja.id)
    });
  }

  deleteQueja(id: string): void {
    this.sharedService.delete_Queja(id).subscribe({
      next: (res) => {
        if (res.data?.deleteQueja?.id || res.data?.deleteQueja?.success) {
          this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Registro de queja eliminado correctamente' });
          this.loadQuejas();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la queja' });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la queja' });
      }
    });
  }
}
