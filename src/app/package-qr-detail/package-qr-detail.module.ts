import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageQrDetailPageRoutingModule } from './package-qr-detail-routing.module';

import { PackageQrDetailPage } from './package-qr-detail.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackageQrDetailPageRoutingModule,
    NgxQRCodeModule
  ],
  declarations: [PackageQrDetailPage]
})
export class PackageQrDetailPageModule {}
