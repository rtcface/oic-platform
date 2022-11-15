
export interface history_update {
    id: string; 
    ente_publico: string; 
    p1: boolean;
    p2: boolean;
    p3: boolean;
    p4: boolean;
    p5: boolean;
    p6: boolean;
    p7: boolean;
    p8: boolean;
    p9: boolean;
    p10: boolean;
    p11: boolean;
    p12: boolean;
    p13: boolean;
    p14: boolean;
    p15: boolean;
    p16: boolean;
}

export interface staditics {
    p1: boolean;
    p2: boolean;
    p3: boolean;
    p4: boolean;
    p5: boolean;
    p6: boolean;
    p7: boolean;
    p8: boolean;
    p9: boolean;
    p10: boolean;
    p11: boolean;
    p12: boolean;
    p13: boolean;
    p14: boolean;
    p15: boolean;
    p16: boolean;
}

export interface rules{
    rules:[history_update];
}

export interface staditics_request{
    staditics: staditics[]
}

export interface history_init{
    ente_publico: string;
}

export interface ente{
    id: string;
    nombre_ente: string;
}

export interface entesRequest{
    entes:ente[];
}

export interface staditics {
    labels: string[];
    datasets: dataset;
}

export interface dataset {
    label: string;
    backgroundColor: string[];
    data:number[];
}

