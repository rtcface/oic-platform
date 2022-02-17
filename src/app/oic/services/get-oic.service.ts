import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OicInterface } from '../models/oic.interface';
import { tree } from '../models/tree.interface';


@Injectable({
  providedIn: 'root'
})
export class GetOicService {

  constructor( private http: HttpClient ) { }

  getOic(): Observable<OicInterface> {
    return this.http.get<OicInterface>('assets/db/entes.json');
  }
  getMenu(): Observable<tree> {
    return this.http.get<tree>('assets/db/plan-trabajo.json');
  }
}
