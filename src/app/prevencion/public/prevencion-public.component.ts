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
        return activities.filter(act =>
          act.dependency.toLowerCase().includes(oic.nombre_ente.toLowerCase())
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.chartData$ = combineLatest([
      this.prevencionService.getChartData().pipe(catchError(() => of(null))),
      oic$
    ]).pipe(
      map(([chartData, oic]) => {
        if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
          return chartData;
        }

        if (!oic || !oic.nombre_ente) {
          return chartData;
        }

        const filteredLabels: string[] = [];
        const filteredData: number[] = [];
        const dataLength = chartData.datasets[0].data ? chartData.datasets[0].data.length : 0;

        if (chartData.labels && chartData.labels.length > 0) {
          chartData.labels.forEach((label: string, index: number) => {
            if (!label) return;
            const matchName = oic.nombre_ente.toLowerCase().includes(label.toLowerCase()) ||
                              label.toLowerCase().includes(oic.nombre_ente.toLowerCase());

            if (matchName && index < dataLength) {
              const val = chartData.datasets[0].data[index];
              if (val !== undefined && val !== null) {
                filteredLabels.push(label);
                filteredData.push(val);
              }
            }
          });
        }

        if (filteredLabels.length > 0) {
          return {
            labels: filteredLabels,
            datasets: [
              {
                label: chartData.datasets[0].label,
                backgroundColor: chartData.datasets[0].backgroundColor,
                data: filteredData
              }
            ]
          };
        } else {
          return {
            labels: [oic.nombre_ente],
            datasets: [
              {
                label: chartData.datasets[0].label,
                backgroundColor: chartData.datasets[0].backgroundColor,
                data: [0]
              }
            ]
          };
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  onOicSelected(oic: OicInterface): void {
    this.selectedOicSubject.next(oic);
  }

  ngOnDestroy(): void {
    this.selectedOicSubject.complete();
  }
}
