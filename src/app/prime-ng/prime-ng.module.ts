import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { MenubarModule } from 'primeng/menubar';
import { NgModule } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';




@NgModule({
  exports:[
    AutoCompleteModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    ChartModule,
    DialogModule,
    DividerModule,
    FieldsetModule,
    MenubarModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PanelModule,
    PasswordModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    MessageModule,
    MessagesModule
  ]
})
export class PrimeNgModule { }
