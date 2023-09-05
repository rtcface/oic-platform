

export interface RegisterColaborador {
    registerColaborador: {
    haveError: boolean;
    Err: string;
}
}

export interface UpdateColaborador {
    updateColaborador: {
    haveError: boolean;
    Err: string;
}
}

export interface registerMember {
    registerMember: {
    id: string;
    email: string;
}
}

export interface registerPresident {
    registerPresident: {
    id: string;
    email: string;
}
}


export interface findPresident{

    PresidetByEnte:{
        id: string;
      }

}