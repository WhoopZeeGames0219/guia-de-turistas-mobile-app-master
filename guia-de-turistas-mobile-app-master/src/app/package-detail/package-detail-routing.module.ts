import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageDetailPage } from './package-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PackageDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackageDetailPageRoutingModule {}
