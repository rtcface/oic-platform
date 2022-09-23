import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';
import { node, user_edit } from '../../models/colaborador.interface';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TreeComponent implements OnInit {
  //@Output() onShowMessage: EventEmitter<boolean> = new EventEmitter();
  @Output() onNodeSelected: EventEmitter<user_edit> = new EventEmitter();
  // Inpu for tree component recive filterEnte or filterBoss
  @Input() filterData: filterBoss | filterEnte | null = null;
  @Input() data: TreeNode[] = [];

  constructor(
    private readonly as: AuthService
  ) { }

  ngOnInit(): void {
    this.purgeTree();
    }

  display: boolean = false;

  onNodeSelect(event: node) {
    //this.onShowMessage.emit(true);
    const { name,email,charge,phone,id } = event.node;  
    this.onNodeSelected.emit({name,email,charge,phone,id}); 
    ////console.log(name);
  }

  purgeTree() {
    this.data = [];
  }

  counterRender(): boolean {
    //console.log('Render de tree');
    return true;
  }


}
