import { Avatar } from "primeng/avatar";

export interface Colaborador {
    name: string;
    email: string;
    charge: string;
    phone:  string;
    parentId: string;
}

export interface President {
    name: string;
    email: string;    
    phone:  string;
    ente_publico: string;
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

export interface delete_user{
    id: string;
}

export interface user_card{
    name: string;
    email: string;   
    avatar: string;
    isLogin: boolean;
}


