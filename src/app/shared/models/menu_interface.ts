export interface items {
    label: string;
    icon: string;
    routerLink: string;
    queryParams: object;
}

export interface menu {
    items: items[];
}

export interface params_menu {
    role: string;
    portal: string;
}