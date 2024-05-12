import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageQrDetailPage } from './package-qr-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PackageQrDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class PackageQrDetailPageRoutingModule {}
