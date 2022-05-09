export interface items {
    label: string;
    icon: string;
    routerLink: string;
}

export interface menu {
    items: items[];
}

export interface params_menu {
    role: string;
    portal: string;
}