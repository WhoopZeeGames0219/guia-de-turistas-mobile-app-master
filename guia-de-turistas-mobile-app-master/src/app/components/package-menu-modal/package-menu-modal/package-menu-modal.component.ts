import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PackageService } from 'src/app/services/package.service';
import { Package } from 'src/interfaces/package';

@Component({
  selector: 'app-package-menu-modal',
  templateUrl: './package-menu-modal.component.html',
  styleUrls: ['./package-menu-modal.component.scss'],
})
export class PackageMenuModalComponent implements OnInit {

  @Input() packageId: string;

  packageSubscription: Subscription;
  package: Package = {};
  images: any[] = [];
  slideOpts = {
    slidesPerView: 1.5,
    spaceBetween: 5,
    speed: 400,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 2000
    },
}
  constructor(private packageService: PackageService,
              private modalController: ModalController) { }

  ngOnInit( ) {
    console.log(this.packageId, 'package iddddddddddd');
     // get package from package service and add to this.package
     this.packageSubscription = this.packageService.getSinglePackage(this.packageId).subscribe((pack: Package) => {
      this.package = pack;
      this.images = this.package.images;
    });

  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ngOnDestroy() {
    if(this.packageSubscription) this.packageSubscription.unsubscribe();
  }


}
