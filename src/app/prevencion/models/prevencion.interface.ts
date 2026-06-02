export interface Activity {
  name: string;
  date: string;
  dependency: string;
}

export interface Complaint {
  municipality: string;
  total: number;
}

export interface ChartDataset {
  label: string;
  backgroundColor: string;
  data: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}
