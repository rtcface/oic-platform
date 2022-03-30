export interface Colaborador {
    name: string;
    email: string;
    charge: string;
    phone:  string;
    parentId: string;
}

export interface DataColaborador {
    colaborador: {
        name: string;
        email: string;
        charge: string;
        phone:  string; 
        parentId: string;
    }
}
    