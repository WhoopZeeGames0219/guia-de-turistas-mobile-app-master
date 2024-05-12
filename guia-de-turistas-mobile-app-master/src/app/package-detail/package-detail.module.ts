import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageDetailPageRoutingModule } from './package-detail-routing.module';
import { CalendarService } from '../services/calendar.service'
import { PackageDetailPage } from './package-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackageDetailPageRoutingModule
  ],
  declarations: [PackageDetailPage],
  providers: [CalendarService]
})
export class PackageDetailPageModule {}
