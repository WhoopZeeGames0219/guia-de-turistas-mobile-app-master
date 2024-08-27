import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, NavController, ToastController } from '@ionic/angular';
import { Purchase } from '../../interfaces/purchase'
import { PackageService} from './../services/package.service';
import { PurchaseService} from './../services/purchase.service';
import { LoadingService} from './../services/loading.service'
import { AuthService} from './../services/auth.service';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { User } from 'firebase';



@Component({
  selector: 'app-my-packages',
  templateUrl: './my-packages.page.html',
  styleUrls: ['./my-packages.page.scss'],
})
export class MyPackagesPage implements OnInit {

  constructor( private purchaseService: PurchaseService,
                public toast: ToastController,
                public navController: NavController,
                private loadingService: LoadingService,) { }

  purchasesSubscription: Subscription;
  activePurchases = [];
  expiredPurchases = [];
  loading: any;

  async ngOnInit() {
    const user = JSON.parse((await Preferences.get({ key: 'user' })).value);
    if(!user){
      await this.navController.navigateRoot('/login', {
        animationDirection: 'back'
      });
      return true
    }
    this.loading = await this.loadingService.loading();
    await this.loading.present();  
    const today = new Date();  
    today.setHours(0,0,0,0);
    today.setDate(today.getDate()-1);
    this.purchaseService.getPurchases(user.uid);
    this.purchasesSubscription = this.purchaseService.$purchases
            .subscribe(async purchases => {
              if (!purchases) {
                await this.loadingService.removeLoading(this.loading);
                return;
              }

              this.activePurchases = purchases.filter((p: Purchase) => (p.validated === false && (new Date(p.reservationDate) >= today) && p.paid !== false));
              this.expiredPurchases = purchases.filter((p: Purchase) => (p.validated === true || (new Date(p.reservationDate) < today) && p.paid !== false));
              await this.loadingService.removeLoading(this.loading);
            });
    console.log(this.activePurchases, this.expiredPurchases,this.expiredPurchases.length !== 0);
  }

  async selectedPurchase(purchase: Purchase){
   try {
    this.purchaseService.setDetailPurchase(purchase);
    await Preferences.set({key: 'selectedPurchase', value: JSON.stringify(purchase)});
    await this.navController.navigateForward('/package-qr-detail', {
      animationDirection: 'forward'
    });
   } catch (error) {
     console.log(error)
     const toast = await this.toast.create({
      message: 'Ocurrió un error. Vuelve a intentar más tarde.',
      duration: 3000
    });
    await toast.present();
   }
    
  }

  async goToPanel(){
    await this.navController.navigateForward('/panel', {
      animationDirection: 'forward'
    });
  }
}
