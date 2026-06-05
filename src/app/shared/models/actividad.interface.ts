export interface Evidencia {
  titulo: string;
  archivo: string;
}

export interface Actividad {
  titulo: string;
  descripcion: string;
  evidencias: Evidencia[];
}
