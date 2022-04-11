import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { user_edit } from '../../models/colaborador.interface';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewUsersComponent implements OnInit {

  @Input() users: user_edit = {} as user_edit;
  constructor() { }

  ngOnInit(): void {
  }

  counterRender(): boolean {
    console.log('Render de view-users');
    return true;
  }
  

}
