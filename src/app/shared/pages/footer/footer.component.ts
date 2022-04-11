import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent  {

  anio:number = new Date().getFullYear();
  
  constructor() { }

  counterRender(): boolean{

    console.log("Render de footer");
    return true;
  }

}
