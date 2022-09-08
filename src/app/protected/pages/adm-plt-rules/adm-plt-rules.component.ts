import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adm-plt-rules',
  templateUrl: './adm-plt-rules.component.html',
  styleUrls: ['./adm-plt-rules.component.scss']
})
export class AdmPltRulesComponent implements OnInit {

  

  rules: any[] = [
    {name: 'Regla de integridad de actuación pública.', key: 'A'},
    {name: 'Regla de integridad de información pública.', key: 'B'},
    {name: 'Regla de integridad de contrataciones públicas, licencias, permisos, autorización y concesiones.', key: 'C'}, 
    {name: 'Regla de integridad de programas gubernamentales.', key: 'D'},
    {name: 'Regla de integridad de programas de política social.', key: 'E'},
    {name: 'Regla de integridad de trámites y servicios.', key: 'F'},
    {name: 'Regla de integridad de Recursos Humanos.', key: 'G'},
    {name: 'Regla de integridad de Administración de bienes muebles e inmuebles.', key: 'H'},
    {name: 'Regla de integridad de procesos de evaluación.', key: 'I'},
    {name: 'Regla de integridad de control interno.', key: 'J'},
    {name: 'Regla de integridad de Procedimiento Administrativo.', key: 'K'},
    {name: 'Regla de desempeño permanente con integridad.', key: 'L'},
    {name: 'Regla de cooperación con la integridad.', key: 'M'},
    {name: 'Regla de integridad de comportamiento digno.', key: 'N'},
    {name: 'Regla de integridad de prevención de la discriminación.', key: 'O'},
    {name: 'Regla de integridad de prevención de acoso laboral.', key: 'P'}];

  constructor() { }

  ngOnInit(): void {
  }

}
