import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { filterBoss, filterEnte } from 'src/app/oic/models/tree.interface';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})

export class TreeComponent implements OnInit {
  @Output() onShowMessage: EventEmitter<boolean> = new EventEmitter();
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

  onNodeSelect(event: any) {
    this.onShowMessage.emit(true);
  }

  purgeTree() {
    this.data = [];
  }


}
