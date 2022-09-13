import { data } from '../../auth/interfaces/user_token.interface';
export interface kpiAdd {
    ente_publico: string;
    kpi: string;
    description: string;
    total_casos: number;
}

export interface kpiByEnteQueryInput {
    ente_publico: string;
}

export interface chart{   
    kpi: string;
    total_casos: number;    
}

export interface resp{
    chart: [chart];
}

export interface kpiSelector{
    name: string;
    value: string;
    icon: string;
}