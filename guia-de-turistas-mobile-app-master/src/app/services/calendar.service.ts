import { Injectable } from '@angular/core';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult
} from 'ion2-calendar';
import { ModalController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(public modalCtrl: ModalController) { }

  async openCalendar(options: CalendarModalOptions): Promise<CalendarResult>{

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });
    console.log('Presenting')
    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;

    return date
  }
}
