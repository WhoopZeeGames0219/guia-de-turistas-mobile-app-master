import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanelPageRoutingModule } from './panel-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PanelPage } from './panel.page';
import { ScrollHideDirective } from '../directives/scroll-hide.directive';
import { CalendarService } from '../services/calendar.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanelPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [PanelPage, ScrollHideDirective],
  providers: [CalendarService]
})
export class PanelPageModule {}
