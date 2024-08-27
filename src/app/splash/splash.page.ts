import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class Splash {

  constructor(public modalCtrl: ModalController) { 

  }

  ionViewDidEnter() {

    SplashScreen.hide();
    var element = document.getElementById("Layer_1");
    element.classList.add("active");
  
    setTimeout(() => {
      this.modalCtrl.dismiss();
    }, 3500);

  }

}
