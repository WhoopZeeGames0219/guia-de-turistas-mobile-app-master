import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyPoliticsPage } from './privacy-politics.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPoliticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyPoliticsPageRoutingModule {}
