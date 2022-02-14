import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { MenubarModule } from 'primeng/menubar';
import { NgModule } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { PanelModule } from 'primeng/panel';


@NgModule({
  exports:[
    AutoCompleteModule,
    AvatarModule,
    FieldsetModule,
    MenubarModule,
    ToolbarModule,
    DividerModule,
    OrganizationChartModule,
    PanelModule
  ]
})
export class PrimeNgModule { }
