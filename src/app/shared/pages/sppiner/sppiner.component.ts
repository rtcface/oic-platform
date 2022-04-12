import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-sppiner',
  template: `<div *ngIf=" isLoading$ | async  " class="loading">
                <div class="lds-ripple"><div></div><div></div></div>
            </div>`,
  styleUrls: ['./sppiner.component.scss']
})
export class SppinerComponent  {

  isLoading$ = this.sh.isLoading$;
  constructor(private readonly sh:SharedService) { }

  

}
