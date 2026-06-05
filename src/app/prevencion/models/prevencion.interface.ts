export interface Evidence {
  name: string;
  url: string;
  type: 'document' | 'photo';
}

export interface Activity {
  name: string;
  description?: string;
  date: string;
  dependency: string;
  evidence?: Evidence[];
}

export interface Complaint {
  municipality: string;
  total: number;
  procedentes: number;
  improcedentes: number;
}

export interface ChartDataset {
  label: string;
  backgroundColor: string | string[];
  hoverBackgroundColor?: string | string[];
  data: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}
