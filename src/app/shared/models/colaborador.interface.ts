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

export interface user_edit {
    id: string;
    name: string;
    email: string;
    charge: string;
    phone:  string;
}

export interface node{
    node:{
    name: string;
    email: string;
    charge: string;
    phone:  string;
    id: string;}
}
    