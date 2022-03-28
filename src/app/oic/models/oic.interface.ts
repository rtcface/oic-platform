export interface OicInterface {
    id: string;
    nombre_ente: string;
    siglas_ente: string;
    data: []
}

export interface OicInterfaceGql {
    id: string;
    nombre_ente: string;
    siglas_ente: string;
    items:OicInterfaceGql[];   
}

export interface OicEnte{
    ente: OicInterface;
}

