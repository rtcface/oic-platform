import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent  {

  @Input() text_footer: string = "";
  
  anio:number = new Date().getFullYear();
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log("en el ngOnChanges", this.text_footer);

    
  }

}
