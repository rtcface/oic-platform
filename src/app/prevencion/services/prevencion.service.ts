import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Activity, Complaint, ChartData } from '../models/prevencion.interface';

@Injectable({
  providedIn: 'root'
})
export class PrevencionService {
  private initialActivities: Activity[] = [
    { name: 'Capacitación en ética', date: '2023-01-15', dependency: 'OIC Xalapa' },
    { name: 'Revisión de procesos', date: '2023-02-10', dependency: 'OIC Veracruz' },
    { name: 'Taller de transparencia', date: '2023-03-05', dependency: 'OIC Boca del Río' },
    { name: 'Foro de prevención', date: '2023-04-20', dependency: 'OIC Xalapa' }
  ];

  private initialChartData: ChartData = {
    labels: ['OIC Xalapa', 'OIC Veracruz', 'OIC Boca del Río', 'OIC Coatzacoalcos', 'OIC Córdoba'],
    datasets: [
      {
        label: 'Quejas por Violencia Institucional',
        backgroundColor: '#42A5F5',
        data: [12, 8, 5, 10, 3]
      }
    ]
  };

  constructor() {}

  getActivities(): Observable<Activity[]> {
    return of(this.initialActivities);
  }

  getChartData(): Observable<ChartData> {
    return of(this.initialChartData);
  }

  saveActivity(activity: Activity): Observable<boolean> {
    // Mock saving the activity
    return of(true);
  }

  saveComplaint(complaint: Complaint): Observable<boolean> {
    // Mock saving the complaint
    return of(true);
  }
}
