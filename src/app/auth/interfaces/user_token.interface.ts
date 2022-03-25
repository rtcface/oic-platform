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

export interface TreeColaboradores {
    data: TreeColaboradoresData;
}

export interface TreeColaboradoresData {
    getColaboresTreeData: GetColaboresTreeData;
}

export interface GetColaboresTreeData {
    label:      string;
    type:       string;
    styleClass: string;
    expanded:   boolean;
    data:       GetColaboresTreeDataData;
    children?:  GetColaboresTreeData[];
}

export interface GetColaboresTreeDataData {
    name:   string;
    avatar: string;
}

