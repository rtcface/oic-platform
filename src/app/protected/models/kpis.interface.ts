import { data } from '../../auth/interfaces/user_token.interface';
import { UrlSegment } from '@angular/router';
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

export interface cdoEthic{
    id: string;
    description: string;
    url: string;
    ente_publico: string;
}

export interface updateCdoEthic{
    id: string;
    description: string;
    url:string;
}

export interface requestCdo{
    cdo:cdoEthic;
}

export interface cdoSaveEthic{   
    description: string;
    url: string;
    ente_publico: string;   
}

export interface delete_cdo{
    id: string;
}

export interface resApiAddCdo{
    id: string;
}

export interface cdo{
    cdo:resApiAddCdo;
}