import { user_register } from ".";

export interface data {
    login:content;
    errors:string[];
    verify_authentication:content;
}

export interface content{
    haveError: boolean;
    Err: string;
    token: string;
    user: user_register;
}
