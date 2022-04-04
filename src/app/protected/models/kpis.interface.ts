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
    chart:{
    kpi: string;
    total_casos: number;    
    }
}