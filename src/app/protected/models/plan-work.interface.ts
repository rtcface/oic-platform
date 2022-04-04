
export interface planWork {
    id: string;
    label: string;
    data: string;
    url: string;
}

export interface planWorkDataAdd {
    IdParent: string;
    label: string;
    data: string;
    url: string;
}

export interface deletePlanWork{
    id: string;
}
