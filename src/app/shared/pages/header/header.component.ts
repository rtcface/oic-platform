import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class HeaderComponent {

  @Input() title_page: string = "";
 

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("en el ngOnChanges", this.title_page);
  }

}
