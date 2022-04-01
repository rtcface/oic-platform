import { Component, Input, OnInit } from '@angular/core';
import { user_edit } from '../../models/colaborador.interface';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {

  @Input() users: user_edit = {} as user_edit;
  constructor() { }

  ngOnInit(): void {
  }

  

}
