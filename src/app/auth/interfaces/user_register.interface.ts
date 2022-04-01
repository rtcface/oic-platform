export interface user_register {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    password_confirmation: string;
    charge: string;
    phone: string;
    createdAt: Date;
    status: string;
    colaboradores: string[];
    role: string;
    createByGoogle: boolean;    
    ente_publico: string;
}