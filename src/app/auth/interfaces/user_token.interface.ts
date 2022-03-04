import { user_register } from ".";

export interface data {    
    haveError: boolean;
    Err: string;
    token: string;
    user: user_register;
}

export interface login {
    login: data;
}