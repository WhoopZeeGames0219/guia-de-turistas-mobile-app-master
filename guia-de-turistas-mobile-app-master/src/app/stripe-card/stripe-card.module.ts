import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripeCardPageRoutingModule } from './stripe-card-routing.module';

import { StripeCardPage } from './stripe-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripeCardPageRoutingModule
  ],
  declarations: [StripeCardPage]
})
export class StripeCardPageModule {}
