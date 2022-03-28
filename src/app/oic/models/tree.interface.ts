export interface tree {
    data: [];
}

export interface root {
    label:         string;
    data:          string;
    expandedIcon:  string;
    collapsedIcon: string;
    children:      RootChild[];
}

export interface RootChild {
    label:         string;
    data:          string;
    expandedIcon:  string;
    collapsedIcon: string;
    children:      ChildChild[];
}

export interface ChildChild {
    label:       string;
    icon:        string;
    RouterLink?: string;
    data?:       string;
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