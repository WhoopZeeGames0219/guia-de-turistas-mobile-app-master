import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripeCardPage } from './stripe-card.page';

const routes: Routes = [
  {
    path: '',
    component: StripeCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripeCardPageRoutingModule {}
