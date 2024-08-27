import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyPoliticsPageRoutingModule } from './privacy-politics-routing.module';

import { PrivacyPoliticsPage } from './privacy-politics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPoliticsPageRoutingModule
  ],
  declarations: [PrivacyPoliticsPage]
})
export class PrivacyPoliticsPageModule {}
