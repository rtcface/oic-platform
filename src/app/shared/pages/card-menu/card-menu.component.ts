import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss']
})
export class CardMenuComponent implements OnInit {
  
  @Input() title: string = '';
  @Input() uri_icon: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

}
