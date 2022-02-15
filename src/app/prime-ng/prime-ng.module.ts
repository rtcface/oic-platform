import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { MenubarModule } from 'primeng/menubar';
import { NgModule } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';



@NgModule({
  exports:[
    AutoCompleteModule,
    AvatarModule,
    CardModule,
    DialogModule,
    FieldsetModule,
    MenubarModule,
    ToolbarModule,
    DividerModule,
    OrganizationChartModule,
    PanelModule,
    ButtonModule
  ]
})
export class PrimeNgModule { }
