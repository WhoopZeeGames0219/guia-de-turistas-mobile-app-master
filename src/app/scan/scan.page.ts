import { Component, OnInit, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { User } from './../../interfaces/user';
import { Purchase } from '../../interfaces/purchase'
import { PurchaseService} from './../services/purchase.service';
import { UserService} from './../services/user.service';
import { AlertController, NavController, ToastController, ModalController } from '@ionic/angular';
import { LoadingService} from './../services/loading.service'
import { IpAddressService} from './../services/ip-address.service'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Subscription } from 'rxjs';
import { LineChartComponent } from '@swimlane/ngx-charts'
import { PackageMenuModalComponent } from '../components/package-menu-modal/package-menu-modal/package-menu-modal.component';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

  @ViewChild('chart') chart: LineChartComponent;

  constructor(
              private purchaseService: PurchaseService,
              private userService: UserService,
              private alertController: AlertController,
              private loadingService: LoadingService,
              public modalController: ModalController,
              private ipAddressService:IpAddressService,
              public toast: ToastController,
              private nav: NavController) { 
                this.selectedPurchaseSubscription = this.purchaseService.$selectedPurchase
                .subscribe( (p: Purchase) => {
                  this.scannedPurchase = p;
                });
                this.ipAddressSubscription = this.ipAddressService.getIPAddress().subscribe((res: any) => {
                  if(res && res.api){
                    this.ipAddress = res.ip;
                  } else{
                    this.ipAddress = 'null'
                  }
                });
                this.userSubscription = this.userService.$user.subscribe(
                  async User => {
                    if (!Object.keys(User).length) {
                      const user = JSON.parse((await Preferences.get({ key: 'user' })).value);
                      if(!user){
                        await this.nav.navigateRoot('/login', {
                          animationDirection: 'back'
                        });
                        return false;
                      } 

                      if(user.scans){
                        for (let index = 0; index < user.scans.length; index++) {
                          const element = user.scans[index];
                          this.today = new Date();
                          if (new Date(element.date).getUTCDate() === this.today.getUTCDate() &&
                          new Date(element.date).getUTCMonth() === this.today.getUTCMonth() &&
                          new Date(element.date).getUTCFullYear() === this.today.getUTCFullYear()) {
                              this.todayScans.push(element); 
                          }
                        }
                      }
                      return this.userService.getUser(user.uid);
                    }
                    this.user = User;
                    if(this.user?.sponsors){
                      this.selectedSponsor = this.user.sponsors[0];
                      this.sponsorsList = this.user.sponsors;
                      this.setXAxisChart(); //Update Graph Data
                    }
                    this.userSubscription?.unsubscribe(); //We just need to get user one time
                 }); 
              }

  qrData: any = '';
  user: User;
  selectedPurchaseSubscription: Subscription;
  ipAddressSubscription: Subscription;
  userSubscription: Subscription;
  selectedSponsorSubscription: Subscription;
  ipAddress: string = '';
  scannedPurchase: Purchase;
  // loading: any;
  todayScans = [];
  sponsorsList = [];
  selectedSponsor: {name?: string, userId?: string} = {};
  selectedfilter = 'week';
  filterText = 'los últimos 7 días';
  filters = [{label: 'Última semana', value: 'week'},
            {label: 'Últimas 4 semanas', value: '4weeks'}, 
            {label: 'Últimos 3 meses', value: '3months'}];
  monthsLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] 
  colorScheme = {
    domain: ['#fcbf49', '#eae2b7', '#d62828']
  };
  graphData = [];
  today = new Date();
  totalValidatedPackages: number = 0;

  async ngOnInit() {

    const user = JSON.parse((await Preferences.get({ key: 'user' })).value);
    if (user.type === 1) {
      this.nav.navigateRoot('panel');
    }
    if (user.type === 3) {
      this.nav.navigateRoot('/sponsor');
    }
  }

  // async getValidatedPurchases() {
  //   const loading = await this.loadingService.loading();
  //   this.totalValidatedPackages = 0;
  //   this.user.scans.map(async (scan: any) => {
  //     const purchase = await this.purchaseService.getPurchase(scan.userId + '/' + scan.purchaseId);
  //       if(purchase?.quantity){
  //         this.totalValidatedPackages =  this.totalValidatedPackages + purchase.quantity;
  //       }       
  //   })
  //   this.loadingService.removeLoading(loading);
  // }
  
  async setXAxisChart(){
    // this.loading = await this.loadingService.loading();
    // await this.loading.present();
    this.graphData = [];
    const tempgraphData = [];
    this.today = new Date();
    this.totalValidatedPackages = 0;

    //WEEK FILTER
    if(this.selectedfilter === 'week'){
      this.filterText = 'los últimos 7 días'
      for (let index = 6; index >= 0; index--) {
        const today = new Date();
        const tempDate = today;
        tempDate.setDate((today.getDate() - index));
        let cont = 0;
        if(this.user.scans){
          for (let index = 0; index < this.user.scans.length; index++) {
            const element = this.user.scans[index];
            if(element.sponsorId !== this.selectedSponsor.userId) continue; //jump to next loop
            this.today = new Date();
            if (new Date(tempDate).getDate() === new Date(element.date).getDate() &&
            new Date(tempDate).getMonth() === new Date(element.date).getMonth() &&
            new Date(tempDate).getFullYear() === new Date(element.date).getFullYear()) {
              const purchase = await this.purchaseService.getPurchase(element.userId + '/' + element.purchaseId);
                if(purchase?.quantity){
                  console.log(purchase, 'COMPRAAAAAAAAAAAAAAAAAAA', this.selectedSponsor.userId, 'SPONSOOOOOOR', purchase.quantity, 'CANTIDAAAAAAAADDDD', this.graphData, 'GRAAAPPHHHHHH')
                  this.totalValidatedPackages =  this.totalValidatedPackages + purchase.quantity;
                  cont = cont + purchase.quantity;
                }   
            }
          }
        }
        tempgraphData.push({name:  + tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear(), value: cont })
        console.log(tempgraphData)
        // setTimeout(() => {
        //   this.chart.update();    
        // }, 1000);
      } 
    }
    //4Weeks Filter
    if(this.selectedfilter === '4weeks'){
      this.filterText = 'las últimas 4 semanas';
      for (let index = 27; index >= 0; index--) {
        const today = new Date();
        const tempDate = today;
        tempDate.setDate((today.getDate() - index));
        let cont = 0;
        if(this.user.scans){
          for (let index = 0; index < this.user.scans.length; index++) {
            const element = this.user.scans[index];
            if(element.sponsorId !== this.selectedSponsor.userId) continue; //jump to next loop
            this.today = new Date();
            if (new Date(tempDate).getDate() === new Date(element.date).getDate() &&
            new Date(tempDate).getMonth() === new Date(element.date).getMonth() &&
            new Date(tempDate).getFullYear() === new Date(element.date).getFullYear()) {
              const purchase = await this.purchaseService.getPurchase(element.userId + '/' + element.purchaseId);
              console.log(purchase)
                if(purchase?.quantity){ 
                  this.totalValidatedPackages =  this.totalValidatedPackages + purchase.quantity;
                  cont = cont + purchase.quantity;
                }   
            }
          }
        }
        //If end of week
        if(index === 20 || index === 13 || index === 6 || index === 0){
          console.log('one week counted')
          tempgraphData.push({
            name:
              +tempDate.getDate() +
              "/" +
              (tempDate.getMonth() + 1) +
              "/" +
              tempDate.getFullYear(),
            value: cont,
          });
          //Reset count
        }
      } 
    }

    if(this.selectedfilter === '3months'){
      this.filterText = 'los últimos 3 meses';
      for (let index = 2; index >= 0; index--) {
        const today = new Date();
        const tempDate = today;
        tempDate.setMonth((today.getMonth() - index));
        let cont = 0;
        if(this.user.scans){
          for (let index = 0; index < this.user.scans.length; index++) {
            const element = this.user.scans[index];
            if(element.sponsorId !== this.selectedSponsor.userId) continue; //jump to next loop
            this.today = new Date();
            if (
            new Date(tempDate).getMonth() === new Date(element.date).getMonth()) {
              const purchase = await this.purchaseService.getPurchase(element.userId + '/' + element.purchaseId);
              console.log(purchase)
                if(purchase?.quantity){
                  this.totalValidatedPackages =  this.totalValidatedPackages + purchase.quantity;
                  cont = cont + purchase.quantity;
                }   
            }
          }
        }
        tempgraphData.push({
          name:
            this.monthsLabels[tempDate.getMonth()],
          value: cont
        });        } 
    }

    this.graphData = tempgraphData;
    this.chart.update();    
    
    // await this.loadingService.removeLoading(this.loading);
                        
  }

  sponsorChange(sponsorId: string) {
    for (let index = 0; index < this.sponsorsList.length; index++) {
      console.log(this.sponsorsList[index].userId, sponsorId)
      if(this.sponsorsList[index].userId === sponsorId){
        this.selectedSponsor = this.sponsorsList[index];
        console.log(this.selectedSponsor)
        this.setXAxisChart();
        return;
      }  
    }
  }

  filterChange(filter: string) {
    this.selectedfilter = filter;
    this.setXAxisChart();
  }

  async openCamera(){
    this.qrData = null;
    await BarcodeScanner.checkPermission({ force: true });
    console.log('Permission granted!');
    // await BarcodeScanner.hideBackground();
    console.log('Background hidden!');
    document.body.classList.add("qrscanner");
    BarcodeScanner.startScan().then(async barcodeData => {
      console.log('Barcode data', barcodeData);
      document.body.classList.remove("qrscanner");
      // this.loading = await this.loadingService.loading();
      // await this.loading.present(); 
      if (barcodeData.hasContent) {
        console.log(barcodeData.content); // log the raw scanned content
      } 
      this.qrData = barcodeData.content;
      //Parar cuando no se escaneó nada
      if(!this.qrData) return // await this.loadingService.removeLoading(this.loading);
      const data: string[] = this.qrData.split('/');
      console.log(data)
      if(data.length !== 2){
        const alert = await this.alertController.create({
          header: 'EL código escaneado no es válido.',
          message: '',
          buttons: ['OK']
        });
        // await this.loadingService.removeLoading(this.loading);
        this.resetValues();
        return await alert.present();
      }
      try {
        //Actualizar valor de la compra escaneada
        console.log(data)
        this.purchaseService.setPurchase(this.qrData);
       setTimeout(async () => {
        console.log(JSON.stringify(this.scannedPurchase),'Actual Scanned Purchase state', Object.keys(this.scannedPurchase).length)
        if (Object.keys(this.scannedPurchase).length) {
          if(this.scannedPurchase.restaurantId !== this.user.id){
            const alert = await this.alertController.create({
              header: 'EL código escaneado pertenece a otro centro de consumo.',
              message: '',
              buttons: ['OK']
            });
            // await this.loadingService.removeLoading(this.loading);
            this.resetValues();
            return await alert.present();
          }
          if(this.scannedPurchase.validated)  {             //Ya fue validado
            console.log('ya fue validadoooooooooooooooooo')
            const alert = await this.alertController.create({
              header: 'EL código escaneado ya fue validado.',
              message: '',
              buttons: ['OK']
            });
            // await this.loadingService.removeLoading(this.loading);
            this.resetValues();
            return await alert.present();
          }else {
            const today = new Date(); 
            
            today.setUTCHours(today.getUTCHours() - 5); //Set timezone to Colombia/Mexico
            today.setUTCHours(0,0,0,0); //Set hours, minutes, seconds and milliseconds to 0 of this day

              let day = ("0" + (today.getUTCDate())).slice(-2);
              // current month
              let month = ("0" + (today.getUTCMonth() + 1)).slice(-2);
              // current year
              let year = today.getUTCFullYear();
              //YYYY-MM-DD Format
              const compareDate = (year + "-" + month + "-" + day);
              if(this.scannedPurchase.reservationDate !== compareDate){ //No es de esta fecha el paquete escaneado
                const alert = await this.alertController.create({
                  header: 'Este paquete solo es válido para el: ' + this.scannedPurchase.reservationDate,
                  message: '',
                  buttons: ['OK']
                });
                // await this.loadingService.removeLoading(this.loading);
                this.resetValues();
                return await alert.present();
              }                     
               //Pasó los filtros, ahora a actualizar base de datos
                const date = new Date()
                if(this.user.scans){
                  this.user.scans.push({date: date, ipAddress: this.ipAddress, purchaseId: data[1], userId: data[0], restaurantId: this.scannedPurchase.restaurantId, sponsorId: this.scannedPurchase.sponsorId});
                }
                else{             
                  this.user.scans = [{date: date, ipAddress: this.ipAddress, purchaseId: data[1], userId: data[0], restaurantId: this.scannedPurchase.restaurantId, sponsorId: this.scannedPurchase.sponsorId}];
                }
                this.scannedPurchase.validated = true;
                // await this.loadingService.removeLoading(this.loading);
                this.purchaseService.updatePurchase(this.scannedPurchase, this.qrData).then(res =>{
                  this.userService.updateUser(this.user, this.user.uid).then(async res2 => {
                    this.userService.getUser(this.user.id); //retrieve user again to set chart correct info
                    this.setXAxisChart();
                    const alert = await this.alertController.create({
                      header: '¡Éxito!',
                      subHeader: 'Código validado correctamente.',
                      message: '<ion-icon class="success-icon" name="checkmark-done-sharp"></ion-icon>',
                      buttons: ['Ver platillos', 'Ver mis compras']
                    });
                    const packageDetailsModal = await this.modalController.create({
                      component: PackageMenuModalComponent,
                      componentProps: {
                        packageId: this.scannedPurchase.packageId,
                      }
                    });
                    //If user updated in datbase, reload in memory to updated user
                    await Preferences.set({key: "user", value: JSON.stringify(this.user)});
                    this.resetValues();
                    console.log('antes de presentar')
                    await packageDetailsModal.present();
                    console.log('después de presentar')

                    // await alert.present();
                    return 
                  });
                });
          }
        } else{
          const toast = await this.toast.create({
            message: 'No existe ningúna compra ligada al código QR.',
            duration: 3000
          });
          // await this.loadingService.removeLoading(this.loading);
          this.resetValues();
          return await toast.present();
        }
       }, 1500);

       } catch (error) {
         console.error(error)
         const toast = await this.toast.create({
          message: 'Ocurrió un error. Vuelve a intentar más tarde.   ' + error,
          duration: 3000
        });
        // await this.loadingService.removeLoading(this.loading);
        this.resetValues()
        await toast.present();
       }
    }).catch(async err => {
      console.error('Error', err);
      document.body.classList.remove("qrscanner");
      const toast = await this.toast.create({
       message: 'Ocurrió un error. Vuelve a intentar más tarde.   ' + err,
       duration: 3000
     });
    //  await this.loadingService.removeLoading(this.loading);
     this.resetValues()
     await toast.present();
    });
  }

  resetValues(){
    // if(this.selectedPurchaseSubscription) this.selectedPurchaseSubscription.unsubscribe()
    // if(this.ipAddressSubscription) this.ipAddressSubscription.unsubscribe()
    this.qrData = '';
  }

  async ngOnDestroy() {
    if(this.selectedPurchaseSubscription) this.selectedPurchaseSubscription.unsubscribe()
    if(this.ipAddressSubscription) this.ipAddressSubscription.unsubscribe()
    if(this.userSubscription) this.userSubscription.unsubscribe()
  }
}
