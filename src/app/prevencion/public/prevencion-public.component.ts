import { Component, OnInit } from '@angular/core';
import { OicInterface } from '../../oic/models/oic.interface';

@Component({
  selector: 'app-prevencion-public',
  templateUrl: './prevencion-public.component.html',
  styleUrls: ['./prevencion-public.component.scss']
})
export class PrevencionPublicComponent implements OnInit {
  activities: any[] = [];
  allActivities: any[] = [];
  chartData: any;
  allChartData: any;
  selectedOic: OicInterface | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.allActivities = [
      { name: 'Capacitación en ética', date: '2023-01-15', dependency: 'OIC Xalapa' },
      { name: 'Revisión de procesos', date: '2023-02-10', dependency: 'OIC Veracruz' },
      { name: 'Taller de transparencia', date: '2023-03-05', dependency: 'OIC Boca del Río' },
      { name: 'Foro de prevención', date: '2023-04-20', dependency: 'OIC Xalapa' }
    ];
    this.activities = [...this.allActivities];

    this.allChartData = {
      labels: ['OIC Xalapa', 'OIC Veracruz', 'OIC Boca del Río', 'OIC Coatzacoalcos', 'OIC Córdoba'],
      datasets: [
        {
          label: 'Quejas por Violencia Institucional',
          backgroundColor: '#42A5F5',
          data: [12, 8, 5, 10, 3]
        }
      ]
    };
    this.chartData = this.allChartData;
  }

  onOicSelected(oic: OicInterface): void {
    this.selectedOic = oic;
    this.filterData(oic);
  }

  filterData(oic: OicInterface): void {
    if (!oic || !oic.nombre_ente) {
      this.activities = [...this.allActivities];
      this.chartData = this.allChartData;
      return;
    }

    // Filter activities based on the OIC name or dependency
    this.activities = this.allActivities.filter(act => 
      act.dependency.toLowerCase().includes(oic.nombre_ente.toLowerCase())
    );

    const filteredLabels: string[] = [];
    const filteredData: number[] = [];

    this.allChartData.labels.forEach((label: string, index: number) => {
      // Check if label is in oic's name
      const matchName = oic.nombre_ente.toLowerCase().includes(label.toLowerCase()) || 
                        label.toLowerCase().includes(oic.nombre_ente.toLowerCase());
      
      if (matchName) {
        filteredLabels.push(label);
        filteredData.push(this.allChartData.datasets[0].data[index]);
      }
    });

    if (filteredLabels.length > 0) {
      this.chartData = {
        labels: filteredLabels,
        datasets: [
          {
            label: 'Quejas por Violencia Institucional',
            backgroundColor: '#42A5F5',
            data: filteredData
          }
        ]
      };
    } else {
      // Show empty chart if no match
      this.chartData = {
        labels: [oic.nombre_ente],
        datasets: [
          {
            label: 'Quejas por Violencia Institucional',
            backgroundColor: '#42A5F5',
            data: [0]
          }
        ]
      };
    }
  }
}
