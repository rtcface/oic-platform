import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from "primeng/inputtext";
import { ListboxModule } from 'primeng/listbox';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { NgModule } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';




@NgModule({
  exports:[
    AutoCompleteModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    ChartModule,
    CheckboxModule,
    ConfirmPopupModule,
    DialogModule,
    DividerModule,
    FieldsetModule,
    InputTextModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PanelModule,
    PasswordModule,   
    ToastModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeSelectModule,
    ListboxModule

  ]
})
export class PrimeNgModule { }
