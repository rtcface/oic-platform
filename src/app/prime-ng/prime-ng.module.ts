import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { FieldsetModule } from 'primeng/fieldset';
import { MenubarModule } from 'primeng/menubar';
import { NgModule } from '@angular/core';
import {ToolbarModule} from 'primeng/toolbar';

@NgModule({
  exports:[
    AutoCompleteModule,
    AvatarModule,
    FieldsetModule,
    MenubarModule,
    ToolbarModule
  ]
})
export class PrimeNgModule { }
