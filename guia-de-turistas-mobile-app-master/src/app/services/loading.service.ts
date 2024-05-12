import { Injectable } from '@angular/core';
import {LoadingController, NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public loadingController: LoadingController) { }

  async loading(){
    return await this.loadingController.create({
      animated: true,
      backdropDismiss: false,
      showBackdrop: true,
      spinner: 'circular',
      message: 'Cargando'
    });
  }

  async removeLoading(load: HTMLIonLoadingElement){
    await load.dismiss();
  }
}
