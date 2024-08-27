import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SponsorPage } from './sponsor.page';

const routes: Routes = [
  {
    path: '',
    component: SponsorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SponsorPageRoutingModule {}
