import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { OicInterface } from '../../oic/models/oic.interface';
import { PrevencionService } from '../services/prevencion.service';
import { Activity, ChartData } from '../models/prevencion.interface';

import { MenuItem } from 'primeng/api';
import { user_card } from 'src/app/shared/models/colaborador.interface';
import { Constantes } from 'src/assets/constantes/constantes';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-prevencion-public',
  templateUrl: './prevencion-public.component.html',
  styleUrls: ['./prevencion-public.component.scss']
})
export class PrevencionPublicComponent implements OnInit, OnDestroy {
  private selectedOicSubject = new BehaviorSubject<OicInterface | null>(null);

  activities$!: Observable<Activity[]>;
  chartData$!: Observable<ChartData | null>;

  items: MenuItem[] = [];
  header_title = Constantes.header_oic;
  footer_title = Constantes.footer_oic;
  
  // Variables para el modal de evidencias
  displayEvidenceDialog: boolean = false;
  selectedActivity: Activity | null = null;

  user: user_card = {
    name: 'User',
    email: 'sn@sn.sn',
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    isLogin: false
  };

  constructor(
    private prevencionService: PrevencionService,
    private ss: SharedService
  ) { }

  ngOnInit(): void {
    this.items = this.ss.get_menu_portal({ portal: 'oic', role: 'user' }, { page: 'oic' });

    const oic$ = this.selectedOicSubject.asObservable();

    this.activities$ = combineLatest([
      this.prevencionService.getActivities().pipe(catchError(() => of([]))),
      oic$
    ]).pipe(
      map(([activities, oic]) => {
        if (!oic || !oic.nombre_ente) {
          return activities;
        }
        return activities.filter(act => {
          const dep = act.dependency.toLowerCase();
          const ente = oic.nombre_ente.toLowerCase();
          return dep.includes(ente) || ente.includes(dep);
        });
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.chartData$ = combineLatest([
      this.prevencionService.getComplaints().pipe(catchError(() => of([]))),
      oic$
    ]).pipe(
      map(([complaints, oic]) => {
        if (!oic || !oic.nombre_ente || !complaints || complaints.length === 0) {
          return null;
        }

        const matchingComplaints = complaints.filter(c => {
          const mun = c.municipality.toLowerCase();
          const ente = oic.nombre_ente.toLowerCase();
          return mun.includes(ente) || ente.includes(mun);
        });

        if (matchingComplaints.length > 0) {
          const totalProcedentes = matchingComplaints.reduce((sum, c) => sum + (c.procedentes || 0), 0);
          const totalImprocedentes = matchingComplaints.reduce((sum, c) => sum + (c.improcedentes || 0), 0);

          return {
            labels: [
              `Procedentes (${totalProcedentes})`, 
              `Improcedentes (${totalImprocedentes})`
            ],
            datasets: [
              {
                label: 'Quejas por Violencia Institucional',
                backgroundColor: ['#4CAF50', '#F44336'],
                hoverBackgroundColor: ['#81C784', '#E57373'],
                data: [totalProcedentes, totalImprocedentes]
              }
            ]
          } as ChartData;
        } else {
          // Si no hay datos, mostrar cero
          return {
            labels: ['Procedentes', 'Improcedentes'],
            datasets: [
              {
                label: 'Sin quejas',
                backgroundColor: ['#9E9E9E', '#9E9E9E'],
                data: [0, 0]
              }
            ]
          } as ChartData;
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  onOicSelected(oic: OicInterface): void {
    this.selectedOicSubject.next(oic);
  }

  showEvidence(activity: Activity): void {
    this.selectedActivity = activity;
    this.displayEvidenceDialog = true;
  }

  downloadEvidence(doc: any): void {
    if (!doc.url) return;

    // If it's not a data URL (e.g. it starts with http), open/download directly
    if (!doc.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.url;
      link.target = '_blank';
      link.download = doc.name || 'evidencia';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    try {
      // Parse the data URL to a blob
      const parts = doc.url.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);

      // Determine proper file name with extension
      const ext = this.getExtensionFromMime(mime);
      let fileName = doc.name || 'evidencia';
      if (ext && !fileName.toLowerCase().endsWith('.' + ext)) {
        fileName = `${fileName}.${ext}`;
      }

      // Create link to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (e) {
      console.error('Error handling document download', e);
      // Fallback to direct data URI trigger
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name || 'evidencia';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  getExtensionFromMime(mime: string): string {
    const map: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/gif': 'gif',
      'text/plain': 'txt',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    };
    return map[mime] || '';
  }

  ngOnDestroy(): void {
    this.selectedOicSubject.complete();
  }
}
