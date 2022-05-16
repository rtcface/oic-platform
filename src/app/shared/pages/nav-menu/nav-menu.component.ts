import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { user_card } from '../../models/colaborador.interface';



@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class NavMenuComponent implements OnChanges {

  @Input() items: MenuItem[] = [];
  @Input() user!: user_card;
  

  constructor() {}
  // ngOnInit(): void {    
  //   this.items = this.items;
  // }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("USER DATA CHANGES>>>>>>>>>>>>>>",this.user);
    console.log("nav-menu changes on change=====>>>>>" , this.items);
    // console.log("nav-menu changes>>>>>>>>>>>>>>" , changes);
  //  // Asignar el valor currentValue a la propiedad items
    for (const propName in changes) {
      if (propName === 'items') {
        console.log("nav-menu changes>>>>>>>>>>>>>>" , changes[propName].currentValue);
        this.items = changes[propName].currentValue;
        // this.ngOnInit();
      }
    }

  } 
 
  counterRender(): boolean{
    console.log("Render de nav-menu");
    return true;
  }

  clearMenu() {
    this.items = [];
  }


}

