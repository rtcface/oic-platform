import { data } from '../../auth/interfaces/user_token.interface';
export interface tree {
    data: [root];
}

export interface root {
    label:         string;
    data:          string;
    expandedIcon:  string;
    collapsedIcon: string;
    children:      RootChild[];
}

export interface RootChild {
    id:            string;
    isRoot:       boolean;
    label:         string;
    data:          string;
    expandedIcon:  string;
    collapsedIcon: string;
    children:      ChildChild[];
}

export interface ChildChild {
    isChild:     boolean;
    id:          string;
    label:       string;
    icon:        string;
    RouterLink?: string;
    data?:       string;
    url?:        string;
}

export interface filterEnte{
    boss: {
        ente: string
    }
}
export interface filterBoss{
    boss: {
        boss: string
    }
}

export interface filterWpd{
    ente:{
        ente_publico: string
    }
}

export interface change_password{
    usePass: {
        email: string;
        password : string;
        newPassword : string;
    }
}

