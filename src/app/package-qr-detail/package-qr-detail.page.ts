import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  AlertController,
  NavController,
  ToastController,
} from "@ionic/angular";
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from "@techiediaries/ngx-qrcode";
import { Preferences } from "@capacitor/preferences";
import { Purchase } from "../../interfaces/purchase";
import { PackageService } from "./../services/package.service";
import { PurchaseService } from "./../services/purchase.service";
import { LoadingService } from "./../services/loading.service";
import { AuthService } from "./../services/auth.service";
import { Subscription } from "rxjs";
import { User } from "firebase";
import { Package } from "src/interfaces/package";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-package-qr-detail",
  templateUrl: "./package-qr-detail.page.html",
  styleUrls: ["./package-qr-detail.page.scss"],
})
export class PackageQrDetailPage implements OnInit {
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";
  user: User;
  selectedPurchase: Purchase = {};
  package: Package = {};
  constructor(
    private packageService: PackageService,
    public navController: NavController,
    public toast: ToastController,
    private purchaseService: PurchaseService,
  ) {}

  async ngOnInit() {
    this.packageService.resetPackage();

    // Check if user is logged in local memory
    const user = JSON.parse((await Preferences.get({ key: "user" })).value);
    if (!user) {
      await this.navController.navigateRoot("/login", {
        animationDirection: "back",
      });
      return true;
    }
    // Set user in global variable for purchase purposes
    this.user = user;
    //Get Purchase from service
    this.selectedPurchase = this.purchaseService.getDetailPurchase();
    this.value = user.uid + "/" + this.selectedPurchase.id;
    if (this.selectedPurchase === null) {
      //Return to panel if there is no selected purchase
      return await this.navController.navigateRoot(["/panel"]);
    }
    this.fetchPackageDetails();
  }

  async fetchPackageDetails() {
   this.packageService.getSinglePackage(this.selectedPurchase.packageId).pipe(
      tap((pack) => {
        this.package = pack;
        console.log(this.package, 'inside tapppp');
      }
    )).subscribe();
  }

  visitlink(url: string) {
    window.open(url);
  }

  ionViewDidLeave() {
    this.packageService.resetPackage();
  }

  ngOnDestroy() {}
}
