import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanPageRoutingModule } from './scan-routing.module';

import { ScanPage } from './scan.page';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import {PortalModule} from '@angular/cdk/portal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanPageRoutingModule,
    NgxChartsModule,
    PortalModule
  ],
  declarations: [ScanPage]
})
export class ScanPageModule {}
