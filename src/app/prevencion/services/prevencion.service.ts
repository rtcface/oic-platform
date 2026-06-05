import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Activity, Complaint, ChartData } from '../models/prevencion.interface';

const GET_ACTIVIDADES = gql`
  query GetActividades {
    getActividades {
      id
      titulo
      descripcion
      createdAt
      ente_publico {
        nombre_ente
      }
      evidencias {
        titulo
        archivo
      }
    }
  }
`;

const GET_QUEJAS = gql`
  query GetQuejas {
    getQuejas {
      id
      procedentes
      improcedentes
      ente_publico {
        nombre_ente
      }
    }
  }
`;

const SAVE_ACTIVIDAD = gql`
  mutation SaveActividad($input: ActividadInput!) {
    saveActividad(input: $input) {
      id
      success
    }
  }
`;

const SAVE_QUEJA = gql`
  mutation SaveQueja($input: QuejaInput!) {
    saveQueja(input: $input) {
      id
      success
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class PrevencionService {
  constructor(private readonly apollo: Apollo) {}

  getActivities(): Observable<Activity[]> {
    return this.apollo.query<{ getActividades: any[] }>({
      query: GET_ACTIVIDADES,
      fetchPolicy: 'network-only'
    }).pipe(
      map(res => {
        const list = res.data?.getActividades || [];
        return list.map(item => ({
          name: item.titulo,
          date: item.createdAt,
          dependency: item.ente_publico?.nombre_ente || '',
          evidence: item.evidencias ? item.evidencias.map((ev: any) => ({
            name: ev.titulo,
            url: ev.archivo,
            type: (ev.archivo.startsWith('data:image/') || ev.archivo.toLowerCase().match(/\.(jpg|jpeg|png|gif)/)) ? 'photo' : 'document'
          })) : []
        }));
      })
    );
  }

  getComplaints(): Observable<Complaint[]> {
    return this.apollo.query<{ getQuejas: any[] }>({
      query: GET_QUEJAS,
      fetchPolicy: 'network-only'
    }).pipe(
      map(res => {
        const list = res.data?.getQuejas || [];
        return list.map(item => ({
          municipality: item.ente_publico?.nombre_ente || '',
          procedentes: item.procedentes,
          improcedentes: item.improcedentes,
          total: item.procedentes + item.improcedentes
        }));
      })
    );
  }

  saveActivity(activity: Activity): Observable<boolean> {
    const input = {
      titulo: activity.name,
      descripcion: activity.description || '',
      evidencias: activity.evidence ? activity.evidence.map(ev => ({
        titulo: ev.name,
        archivo: ev.url
      })) : []
    };
    return this.apollo.mutate<{ saveActividad: { id: string; success?: boolean } }>({
      mutation: SAVE_ACTIVIDAD,
      variables: { input }
    }).pipe(
      map(res => !!(res.data?.saveActividad?.success || res.data?.saveActividad?.id))
    );
  }

  saveComplaint(complaint: Complaint): Observable<boolean> {
    const input = {
      procedentes: complaint.procedentes,
      improcedentes: complaint.improcedentes
    };
    return this.apollo.mutate<{ saveQueja: { id: string; success?: boolean } }>({
      mutation: SAVE_QUEJA,
      variables: { input }
    }).pipe(
      map(res => !!(res.data?.saveQueja?.success || res.data?.saveQueja?.id))
    );
  }
}
